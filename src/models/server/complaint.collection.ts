import { Permission } from "node-appwrite";
import { db, complaintCollection } from "../name";
import { databases } from "./config";

export default async function createComplaintCollection() {
  await databases.createCollection(
    db,
    complaintCollection,
    complaintCollection,
    [
      Permission.read("any"),
      Permission.read("users"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  );
  console.log("Complaint collection is created");

  //creating attributes and Indexes
  await Promise.all([
    databases.createStringAttribute(
      db,
      complaintCollection,
      "name",
      50,
      true,
    ),
    databases.createStringAttribute(
      db,
      complaintCollection,
      "email",
      50,
      true,
    ),
    databases.createStringAttribute(
      db,
      complaintCollection,
      "content",
      1000,
      true,
    ),
    databases.createStringAttribute(
      db,
      complaintCollection,
      "subject",
      50,
      true,
    ),
    databases.createStringAttribute(
      db,
      complaintCollection,
      "authorId",
      50,
      true,
    ),
    databases.createBooleanAttribute(
      db,
      complaintCollection,
      "isResolved",
      false,
      false,
    ),
  ]);
  console.log("Complaints Atributes created");
}
