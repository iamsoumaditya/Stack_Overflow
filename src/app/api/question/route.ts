import { databases, users } from "@/src/models/server/config";
import {
  answerCollection,
  db,
  questionCollection,
  voteCollection,
} from "@/src/models/name";
import { Query } from "node-appwrite";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") ?? "";
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 5);

  const offset = (page - 1) * limit;
  const queries: string[] = [
    Query.limit(limit),
    Query.offset(offset),
    Query.orderDesc("$createdAt"),
  ];
  
  let questions;

  if (query.trim() !== "") {
    const byTitle = await databases.listDocuments(db, questionCollection, [
      ...queries,
      Query.search("title", query),
    ]);

    const byContent = await databases.listDocuments(db, questionCollection, [
      ...queries,
      Query.search("content", query),
    ]);

    const byTags = await databases.listDocuments(db, questionCollection, [
      ...queries,
      Query.equal("tags", [query]),
    ]);

    const merged = [
      ...byTitle.documents,
      ...byContent.documents,
      ...byTags.documents,
    ].filter((doc, i, arr) => arr.findIndex((d) => d.$id === doc.$id) === i);

    questions = { documents: merged, total: merged.length };
  } else {
    questions = await databases.listDocuments(db, questionCollection, queries);
  }

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

   questions.documents.sort(
     (a, b) => (b.totalAnswers ?? 0) - (a.totalAnswers ?? 0),
   );
   questions.documents.sort(
    (a, b) => (b.totalVotes ?? 0) - (a.totalVotes ?? 0),
  );

  return NextResponse.json(questions);
}