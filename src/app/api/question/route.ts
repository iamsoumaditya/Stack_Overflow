import { databases, users } from "@/src/models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/src/models/name";
import { Query } from "node-appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  const questions = await databases.listDocuments(db, questionCollection, [
    Query.limit(5),
    Query.orderDesc("$createdAt"),
  ]);

  questions.documents = await Promise.all(
    questions.documents.map(async (ques) => {
      const [author, answers, upvotes, downvotes] = await Promise.all([
        users.get(ques.authorId),

        databases.listDocuments(db, answerCollection, [
          Query.equal("questionId", ques.$id),
          Query.limit(1),
        ]),

        databases.listDocuments(db, voteCollection, [
          Query.equal("type", "question"),
          Query.equal("typeId", ques.$id),
          Query.equal("voteStatus", "upvoted"),
          Query.limit(1),
        ]),

        databases.listDocuments(db, voteCollection, [
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
        author: author,
      };
    })
    );
    
    return NextResponse.json(questions)
}
