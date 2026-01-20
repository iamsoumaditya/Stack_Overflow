import { databases, storage, users } from "@/src/models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  commentCollection,
  voteCollection,
  questionAttachmentBucket,
} from "@/src/models/name";
import { userPrefs } from "@/src/store/Auth";
import { Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Vote } from "@/src/components/VoteButtons";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/question/[id]">,
) {
  const { id } = await params;
  const [question, answers, upvotes, downvotes, comments] = await Promise.all([
    databases.getDocument(db, questionCollection, id),
    databases.listDocuments(db, answerCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("questionId", id),
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", id),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "upvoted"),
      Query.limit(1), // for optimization
    ]),
    databases.listDocuments(db, voteCollection, [
      Query.equal("typeId", id),
      Query.equal("type", "question"),
      Query.equal("voteStatus", "downvoted"),
      Query.limit(1), // for optimization
    ]),
    databases.listDocuments(db, commentCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", id),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  // since it is dependent on the question, we fetch it here outside of the Promise.all
  const author = await users.get<userPrefs>(question.authorId);
  [comments.documents, answers.documents] = await Promise.all([
    Promise.all(
      comments.documents.map(async (comment) => {
        const author = await users.get<userPrefs>(comment.authorId);
        return {
          ...comment,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
    Promise.all(
      answers.documents.map(async (answer) => {
        const [author, comments, upvotes, downvotes] = await Promise.all([
          users.get<userPrefs>(answer.authorId),
          databases.listDocuments(db, commentCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.orderDesc("$createdAt"),
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1), // for optimization
          ]),
          databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", answer.$id),
            Query.equal("type", "answer"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1), // for optimization
          ]),
        ]);

        comments.documents = await Promise.all(
          comments.documents.map(async (comment) => {
            const author = await users.get<userPrefs>(comment.authorId);
            return {
              ...comment,
              author: {
                $id: author.$id,
                name: author.name,
                reputation: author.prefs.reputation,
              },
            };
          }),
        );

        return {
          ...answer,
          comments,
          upvotesDocuments: upvotes,
          downvotesDocuments: downvotes,
          totalVotes: upvotes.total - downvotes.total,
          author: {
            $id: author.$id,
            name: author.name,
            reputation: author.prefs.reputation,
          },
        };
      }),
    ),
  ]);

  answers.documents.sort((a, b) => {
    if (a.isAccepted !== b.isAccepted) {
      return a.isAccepted ? -1 : 1;
    }
    return (b.totalVotes ?? 0) - (a.totalVotes ?? 0);
  });
  return NextResponse.json(
    {
      question,
      author,
      answers,
      comments,
      votes: upvotes.total - downvotes.total,
    },
    { status: 200 },
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext<"/api/question/[id]">,
) {
  const { id } = await params;

  try {
    const question = await databases.getDocument(db, questionCollection, id);

    const answers = await databases.listDocuments(db, answerCollection, [
      Query.equal("questionId", id),
    ]);

    for (const answer of answers.documents) {
      if (answer.isAccepted) {
        const prefs = await users.getPrefs<userPrefs>(answer.authorId);

        await users.updatePrefs(answer.authorId, {
          reputation: Number(prefs.reputation) - 6,
        });
      }

      const prefsAns = await users.getPrefs<userPrefs>(answer.authorId);
      await users.updatePrefs(answer.authorId, {
        reputation: Number(prefsAns.reputation) - 1,
      });

      // Delete comments on this answer
      const answerComments = await databases.listDocuments(
        db,
        commentCollection,
        [Query.equal("type", "answer"), Query.equal("typeId", answer.$id)],
      );
      for (const c of answerComments.documents) {
        await databases.deleteDocument(db, commentCollection, c.$id);
      }

      // Delete votes on this answer
      const answerVotes = await databases.listDocuments<Vote>(
        db,
        voteCollection,
        [Query.equal("type", "answer"), Query.equal("typeId", answer.$id)],
      );

      let delta = 0;
      for (const v of answerVotes.documents) {
        if (v.voteStatus === "upvoted") {
          delta--;
        } else if (v.voteStatus === "downvoted") {
          delta++;
        }
        await databases.deleteDocument(db, voteCollection, v.$id);
      }

      const prefsVotes = await users.getPrefs<userPrefs>(answer.authorId);
      await users.updatePrefs(answer.authorId, {
        reputation: Number(prefsVotes.reputation) + delta,
      });

      // Finally delete the answer itself
      await databases.deleteDocument(db, answerCollection, answer.$id);
    }

    // 2. Delete comments on the question
    const questionComments = await databases.listDocuments(
      db,
      commentCollection,
      [Query.equal("type", "question"), Query.equal("typeId", id)],
    );
    for (const c of questionComments.documents) {
      await databases.deleteDocument(db, commentCollection, c.$id);
    }

    // 3. Delete votes on the question
    const questionVotes = await databases.listDocuments<Vote>(db, voteCollection, [
      Query.equal("type", "question"),
      Query.equal("typeId", id),
    ]);

    let delta = 0;
    for (const v of questionVotes.documents) {
      if (v.voteStatus === "upvoted") {
        delta--;
      } else if(v.voteStatus === "downvoted"){
        delta++;
      }
      await databases.deleteDocument(db, voteCollection, v.$id);
    }

     const prefsQuestionVotes = await users.getPrefs<userPrefs>(question.authorId);
     await users.updatePrefs(question.authorId, {
       reputation: Number(prefsQuestionVotes.reputation) + delta,
     });

    // 4. Delete the question itself
    if (question.attachmentId) {
      await storage.deleteFile(questionAttachmentBucket, question.attachmentId);
    }

    await databases.deleteDocument(db, questionCollection, id);

    return NextResponse.json({ success: true, deleted: id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
