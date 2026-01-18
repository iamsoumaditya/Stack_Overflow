import { databases, users } from "@/src/models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/src/models/name";
import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { userPrefs } from "@/src/store/Auth";
import { ID } from "node-appwrite";

async function adjustReputation(authorId: string, delta: number) {
  const prefs = await users.getPrefs<userPrefs>(authorId);
  await users.updatePrefs<userPrefs>(authorId, {
    reputation: Number(prefs.reputation) + delta,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { votedById, voteStatus, type, typeId } = await request.json();

    const existing = await databases.listDocuments(db, voteCollection, [
      Query.equal("type", type),
      Query.equal("typeId", typeId),
      Query.equal("votedById", votedById),
    ]);

    const QuestionOrAnswer = await databases.getDocument(
      db,
      type === "question" ? questionCollection : answerCollection,
      typeId
    );

    if (existing.total > 0 && existing.documents[0].voteStatus === voteStatus) {
      await databases.deleteDocument(
        db,
        voteCollection,
        existing.documents[0].$id
      );

      await adjustReputation(
        QuestionOrAnswer.authorId,
        voteStatus === "upvoted" ? -1 : +1
      );
    } else {
      if (existing.total > 0) {
        await adjustReputation(
          QuestionOrAnswer.authorId,
          existing.documents[0].voteStatus === "upvoted" ? -1 : +1
        );

        await databases.deleteDocument(
          db,
          voteCollection,
          existing.documents[0].$id
        );
      }

      await databases.createDocument(db, voteCollection, ID.unique(), {
        type,
        typeId,
        voteStatus,
        votedById,
      });

      await adjustReputation(
        QuestionOrAnswer.authorId,
        voteStatus === "upvoted" ? +1 : -1
      );
    }

    const [upvotes, downvotes] = await Promise.all([
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "upvoted"),
      ]),
      databases.listDocuments(db, voteCollection, [
        Query.equal("type", type),
        Query.equal("typeId", typeId),
        Query.equal("voteStatus", "downvoted"),
      ]),
    ]);

    return NextResponse.json(
      {
        votes: {
          upvotes: upvotes.total,
          downvotes: downvotes.total,
          score: upvotes.total - downvotes.total,
        },
        message: "Vote fetched successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Error occurred while creating answers" },
      { status: error?.status || error?.code || 500 }
    );
  }
}
