import { users } from "@/src/models/server/config";
import { Models, Query } from "node-appwrite";
import { userPrefs } from "@/src/store/Auth";
import { NextResponse } from "next/server";

export async function GET() {
  const topUser: Models.UserList<userPrefs> = await users.list<userPrefs>([
    Query.limit(10),
  ]);
  return NextResponse.json(topUser);
}
