import { Permission } from "appwrite";
import { questionAttachmentBucket, db } from "../name";
import { storage } from "./config"

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("Storage Connected")
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.create("users"),
                    Permission.read("users"),
                    Permission.read("any"),
                    Permission.delete("users"),
                    Permission.update("users"),
                ],
                false,
                undefined,
                undefined,
                ["jpeg","png","gif","jpg","webp","heic"]
            )
            console.log("Storage Created")
            console.log("Storage Connected")
        } catch (error) {
            console.error("Error creating storage:",error)
        }
    }
}