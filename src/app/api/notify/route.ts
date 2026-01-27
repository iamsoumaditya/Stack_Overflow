import { messaging } from "@/src/models/server/config";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: Request) {
    const {title,body, userId } = await req.json();
    
  await messaging.createPush(
    ID.unique(),
    title,
    body,
    undefined,
    [userId],
  );

  return NextResponse.json({ success: true });
}
