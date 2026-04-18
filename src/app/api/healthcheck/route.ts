import { db, complaintCollection } from "@/src/models/name";
import { databases } from "@/src/models/server/config";
import { Query } from "node-appwrite";

export async function GET() {
  try {
    const complaints = await databases.listDocuments(db, complaintCollection, [
      Query.limit(1),
    ]);

    return Response.json({
      status: "ok",
      message: "Appwrite active",
      count: complaints.total,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { status: "error", message: "Appwrite failed" },
      { status: 500 },
    );
  }
}
