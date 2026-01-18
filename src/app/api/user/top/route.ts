import { users } from "@/src/models/server/config";
import { Models, Query } from "node-appwrite";
import { userPrefs } from "@/src/store/Auth";
import { NextResponse } from "next/server";

export async function GET() {
  const allUsers = await users.list<userPrefs>();
  const sorted = allUsers.users
    .sort((a, b) => (b.prefs.reputation ?? 0) - (a.prefs.reputation ?? 0))
    .slice(0, 10);

  return NextResponse.json({ users: sorted });
}
