import { databases, users } from "@/src/models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  commentCollection,
  voteCollection,
  complaintCollection,
} from "@/src/models/name";
import { Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";
import { Models } from "appwrite";
import { IAnswer } from "@/src/components/Answers";
import { comment } from "@/src/components/Comments";
import { Question } from "@/src/app/questions/[id]/[name]/page";
import { Vote } from "@/src/components/VoteButtons"; 
import { Complaint } from "@/src/app/users/[Id]/[name]/page";
export interface Data {
  author: Models.User;
  questions: Models.DocumentList<Question>;
  answers: Models.DocumentList<IAnswer>;
  upvotes: Models.DocumentList<Vote>;
  downvotes: Models.DocumentList<Vote>;
  comments: Models.DocumentList<comment>;
  complaints: Models.DocumentList<Complaint>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/user/[id]">,
) {
  const { id } = await params;

  const author = await users.get<Models.User>(id);

  const [questions, answers, upvotes, downvotes, comments,complaints] = await Promise.all([
    databases.listDocuments<Models.Document>(db, questionCollection, [
      Query.orderDesc("$updatedAt"),
      Query.equal("authorId", id),
    ]),
    databases.listDocuments<IAnswer>(db, answerCollection, [
      Query.orderDesc("$updatedAt"),
      Query.equal("authorId", id),
    ]),
    databases.listDocuments<Vote>(db, voteCollection, [
      Query.orderDesc("$updatedAt"),
      Query.equal("voteStatus", "upvoted"),
      Query.equal("votedById", id),
    ]),
    databases.listDocuments<Vote>(db, voteCollection, [
      Query.orderDesc("$updatedAt"),
      Query.equal("voteStatus", "downvoted"),
      Query.equal("votedById", id),
    ]),
    databases.listDocuments<comment>(db, commentCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("authorId", id),
    ]),
    databases.listDocuments<Complaint>(db, complaintCollection, [
      Query.orderDesc("$createdAt"),
      Query.equal("authorId", id),
    ]),
  ]);

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [answers, upvotes, downvotes] = await Promise.all([
        databases.listDocuments<Models.Document>(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),

        databases.listDocuments<Models.Document>(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.equal("voteStatus", "upvoted"),
          Query.limit(1),
        ]),

        databases.listDocuments<Models.Document>(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.equal("voteStatus", "downvoted"),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ques,
        totalAnswers: answers.total,
        totalVotes: upvotes.total - downvotes.total,
      };
    }),
  );

  answers.documents = await Promise.all(
    answers.documents.map(async (ans) => {
      const [question, upvotes, downvotes] = await Promise.all([
        databases.getDocument<Question>(
          db,
          questionCollection,
          ans.questionId,
        ),

        databases.listDocuments<Vote>(db, voteCollection, [
          Query.equal("type", "answer"),
          Query.equal("typeId", ans.$id),
          Query.equal("voteStatus", "upvoted"),
          Query.limit(1),
        ]),

        databases.listDocuments<Vote>(db, voteCollection, [
          Query.equal("type", "answer"),
          Query.equal("typeId", ans.$id),
          Query.equal("voteStatus", "downvoted"),
          Query.limit(1),
        ]),
      ]);

      return {
        ...ans,
        question,
        totalVotes: upvotes.total - downvotes.total,
      };
    }),
  );

  upvotes.documents = await Promise.all(
    upvotes.documents.map(async (vote) => {
      if (vote.type === "question") {
        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          vote.typeId,
        );

        return {
          ...vote,
         question,
        };
      } else {
        const answer = await databases.getDocument<IAnswer>(
          db,
          answerCollection,
          vote.typeId,
        );

        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          answer.questionId,
        );

        return {
          ...vote,
          question,
        };
      }
    }),
  );

  downvotes.documents = await Promise.all(
    downvotes.documents.map(async (vote) => {
      if (vote.type === "question") {
        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          vote.typeId,
        );

        return {
          ...vote,
         question,
        };
      } else {
        const answer = await databases.getDocument<IAnswer>(
          db,
          answerCollection,
          vote.typeId,
        );

        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          answer.questionId,
        );

        return {
          ...vote,
            question,
        };
      }
    }),
  );

  comments.documents = await Promise.all(
    comments.documents.map(async (comment) => {
      if (comment.type === "question") {
        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          comment.typeId,
        );

        return {
          ...comment,
          question,
        };
      } else {
        const answer = await databases.getDocument<IAnswer>(
          db,
          answerCollection,
          comment.typeId,
        );

        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          answer.questionId,
        );

        return {
          ...comment,
            question,
        };
      }
    }),
  );

  return NextResponse.json({
    author,
    questions,
    answers,
    upvotes,
    downvotes,
    comments,
    complaints
  });
}
