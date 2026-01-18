import { Client, Databases, Query } from "node-appwrite";

export default async function (req, res) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const databases = new Databases(client);

  try {
    // Parse the event payload
    const payload = JSON.parse(req.payload);
    const { databaseId, tableId, rowId, collection } = payload;

    // Cascade delete depending on which collection triggered the event
    if (collection === "questions") {
      // Delete answers linked to this question
      const answers = await databases.listRows(databaseId, "answers", [
        Query.equal("questionId", rowId),
      ]);
      for (const ans of answers.documents) {
        await databases.deleteRow(databaseId, "answers", ans.$id);
      }

      // Delete comments on this question
      const comments = await databases.listRows(databaseId, "comments", [
        Query.equal("type", "question"),
        Query.equal("typeId", rowId),
      ]);
      for (const c of comments.documents) {
        await databases.deleteRow(databaseId, "comments", c.$id);
      }

      // Delete votes on this question
      const votes = await databases.listRows(databaseId, "votes", [
        Query.equal("type", "question"),
        Query.equal("typeId", rowId),
      ]);
      for (const v of votes.documents) {
        await databases.deleteRow(databaseId, "votes", v.$id);
      }
    }

    if (collection === "answers") {
      // Delete comments on this answer
      const comments = await databases.listRows(databaseId, "comments", [
        Query.equal("type", "answer"),
        Query.equal("typeId", rowId),
      ]);
      for (const c of comments.documents) {
        await databases.deleteRow(databaseId, "comments", c.$id);
      }

      // Delete votes on this answer
      const votes = await databases.listRows(databaseId, "votes", [
        Query.equal("type", "answer"),
        Query.equal("typeId", rowId),
      ]);
      for (const v of votes.documents) {
        await databases.deleteRow(databaseId, "votes", v.$id);
      }
    }

    res.json({ success: true, deleted: rowId });
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
}
