import {
  answerCollection,
  commentCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/src/models/name";
import { databases, messaging, users } from "@/src/models/server/config";
import { userPrefs } from "@/src/store/Auth";
import { Query } from "appwrite";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();

    const question = await databases.getDocument(
      db,
      questionCollection,
      questionId,
    );

    const response = await databases.createDocument(
      db,
      answerCollection,
      ID.unique(),
      {
        content: answer,
        authorId,
        questionId,
      },
    );

    await messaging.createPush(
      ID.unique(),
      "You just got an answer",
      "Someone just resolved your query checkout & accept if that's right",
      undefined,
      [question.authorId],
    );

    //increase author reputation
    const prefs = await users.getPrefs<userPrefs>(authorId);
    await users.updatePrefs(authorId, {
      reputation: Number(prefs.reputation) + 1,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error occurred while creating answers" },
      { status: error?.status || error?.code || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const answer = await databases.getDocument(db, answerCollection, answerId);

    const answerComments = await databases.listDocuments(
      db,
      commentCollection,
      [Query.equal("type", "answer"), Query.equal("typeId", answer.$id)],
    );

    for (const c of answerComments.documents) {
      await databases.deleteDocument(db, commentCollection, c.$id);
    }

    const answerVotes = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", "answer"),
      Query.equal("typeId", answer.$id),
    ]);

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

    if (answer.isAccepted) {
      const prefs = await users.getPrefs<userPrefs>(answer.authorId);

      await users.updatePrefs(answer.authorId, {
        reputation: Number(prefs.reputation) - 6,
      });
    }

    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId,
    );

    const prefs = await users.getPrefs<userPrefs>(answer.authorId);
    await users.updatePrefs(answer.authorId, {
      reputation: Number(prefs.reputation) - 1,
    });

    return NextResponse.json(
      {
        data: response,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error occurred while deleting answers" },
      { status: error?.status || error?.code || 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { answerId } = await request.json();

    const currentAnswer = await databases.getDocument(
      db,
      answerCollection,
      answerId,
    );

    const prefs = await users.getPrefs<userPrefs>(currentAnswer.authorId);

    if (currentAnswer.isAccepted) {
      await users.updatePrefs(currentAnswer.authorId, {
        reputation: Number(prefs.reputation) - 5,
      });
    } else {
      await users.updatePrefs(currentAnswer.authorId, {
        reputation: Number(prefs.reputation) + 5,
      });
    }

    await databases.updateDocument(db, answerCollection, answerId, {
      isAccepted: !currentAnswer.isAccepted,
    });

    return NextResponse.json({ status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error occurred while Accepting answers" },
      { status: error?.status || error?.code || 500 },
    );
  }
}
