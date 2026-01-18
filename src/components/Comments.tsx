"use client";

import { databases } from "@/src/models/client/config";
import { commentCollection, db } from "@/src/models/name";
import { useAuthStore } from "@/src/store/Auth";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import slugify from "@/src/utils/slugify";
import { ID, Models } from "appwrite";
import Link from "next/link";
import React from "react";
import { MessageCircle, MessageSquare, Trash2, Send } from "lucide-react";
import { comment } from "@uiw/react-md-editor";
import ConfirmDelete from "@/src/components/ConfirmDelete";
import { Question } from "../app/questions/[id]/[name]/page";

interface commentDoc extends Models.Document {
  $id: string;
  $createdAt: string;
  type: "question" | "answer";
  typeId: string;
  content: string;
  authorId: string;
}
export interface comment extends commentDoc {
  author: {
    name: string;
  };
  question?: Question;
}

function AddCommentButton({
  setShowCommentInput,
}: {
  setShowCommentInput: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { session } = useAuthStore();
  return (
    <>
      {session && (
        <button
          onClick={() => setShowCommentInput((prev) => !prev)}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Add comment
        </button>
      )}
      {!session && (
        <Link href={"/login"}>
          <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
            <MessageCircle className="w-4 h-4" />
            Add comment
          </button>
        </Link>
      )}
    </>
  );
}

function AddCommentContent({
  showCommentInput,
  setShowCommentInput,
  type,
  typeId,
  setComments,
}: {
  showCommentInput: boolean;
  setShowCommentInput: React.Dispatch<React.SetStateAction<boolean>>;
  type: "question" | "answer";
  typeId: string;
  setComments: React.Dispatch<
    React.SetStateAction<Models.DocumentList<comment>>
  >;
}) {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = React.useState("");

  const handleSubmit = async () => {
    if (!newComment || !user) return;

    try {
      const response = await databases.createDocument<commentDoc>(
        db,
        commentCollection,
        ID.unique(),
        {
          content: newComment,
          authorId: user.$id,
          type: type,
          typeId: typeId,
        },
      );

      setNewComment(() => "");
      setShowCommentInput((prev) => !prev);
      setComments((prev) => ({
        total: prev.total + 1,
        documents: [
          { ...response, author: { name: user.name } },
          ...prev.documents,
        ],
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error creating comment");
    }
  };
  return (
    <>
      {showCommentInput && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all text-sm"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-rose-600 dark:bg-rose-500 text-white hover:bg-rose-700 dark:hover:bg-rose-600 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}{" "}
    </>
  );
}

function CommentSection({
  comments,
  setComments,
}: {
  comments: Models.DocumentList<comment>;
  setComments: React.Dispatch<
    React.SetStateAction<Models.DocumentList<comment>>
  >;
}) {
  const { user } = useAuthStore();
  const deleteComment = async (commentId: string) => {
    try {
      await databases.deleteDocument(db, commentCollection, commentId);

      setComments((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter(
          (comment) => comment.$id !== commentId,
        ),
      }));
    } catch (error: any) {
      window.alert(error?.message || "Error deleting comment");
    }
  };
  return (
    <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Comments
      </h3>
      <div className="space-y-2">
        {comments.documents.map((comment) => (
          <div
            key={comment.$id}
            className="flex gap-3 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0"
          >
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {comment.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
              <div
                className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-1"
                suppressHydrationWarning
              >
                <span>
                  <Link
                    href={`/users/${comment.authorId}/${slugify(
                      comment.author.name,
                    )}`}
                    className="hover:underline"
                  >
                    {comment.author.name}
                  </Link>{" "}
                  • {convertDateToRelativeTime(new Date(comment.$createdAt))}
                </span>

                {user?.$id === comment.authorId && (
                  <ConfirmDelete
                    onConfirm={deleteComment}
                    message="Are you sure you want to delete this Comment?"
                    arg={comment.$id}
                  >
                    <button className="shrink-0 text-red-500 hover:text-red-600 ml-2">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </ConfirmDelete>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommentCard({ comment }: { comment: comment }) {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0">
      <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
        <MessageSquare className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <Link
          href={`/questions/${comment.question?.$id}/${slugify(comment.question?.title!)}`}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {comment.content}
          </p>
        </Link>
        <div
          className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mt-1"
          suppressHydrationWarning
        >
          <span>{convertDateToRelativeTime(new Date(comment.$createdAt))}</span>
        </div>
      </div>
    </div>
  );
}

export function CommentCardSkeleton() {
  return (
    <div className="flex gap-3 py-2 border-b border-gray-200 dark:border-gray-800 last:border-0 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>

      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>

        <div className="flex items-center justify-between text-xs mt-1">
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
export { AddCommentButton, AddCommentContent, CommentSection };
