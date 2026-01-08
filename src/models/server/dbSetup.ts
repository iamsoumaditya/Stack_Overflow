import { db, questionCollection } from "../name";
import createQuestionCollection from "./question.collection";
import createAnswerCollection from "./answer.collection";
import createVoteCollection from "./vote.collection";
import { createCommentCollection } from "./comment.collection";
import { databases } from "./config";
import { IndexType } from "node-appwrite";

export default async function getOrCreateDB() {
  try {
    await databases.get(db);
    console.log("✅ Database Connected");
  } catch (error) {
    try {
      await databases.create(db, db);
      console.log("Database created");
      //create collections
      await Promise.all([
        createQuestionCollection(),
        createAnswerCollection(),
        createCommentCollection(),
        createVoteCollection(),
      ]);
      //  await Promise.all([
      //    databases.createIndex(
      //      db,
      //      questionCollection,
      //      "title",
      //      IndexType.Fulltext,
      //      ["title"],
      //      ["asc"]
      //    ),
      //    databases.createIndex(
      //      db,
      //      questionCollection,
      //      "content",
      //      IndexType.Fulltext,
      //      ["title"],
      //      ["asc"]
      //    ),
      //  ]);
     // console.log("Questions Index are Created");
      console.log("All collections created successfully");
      console.log("Database connected");
    } catch (error) {
      console.log("Error creating databases or collection", error);
    }
  }

  return databases;
}
