import { Permission } from "node-appwrite"
import { commentCollection, db } from "../name"
import { databases } from "./config"

export  async function createCommentCollection() {
    await databases.createCollection(db, commentCollection, commentCollection, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.delete("users"),
        Permission.update("users"),
    ])
    console.log("Comment collection Craeted")

    //creating Attributes
    await Promise.all([
        databases.createStringAttribute(db, commentCollection, "content", 10000, true),
        databases.createEnumAttribute(db,commentCollection,"type",["answer","question"],true),
        databases.createStringAttribute(db,commentCollection,"typeId",50,true),
        databases.createStringAttribute(db,commentCollection,"authorId",50,true)
    ])
    console.log("Comment Attributes created")
}