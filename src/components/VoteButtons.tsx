"use client";

import { databases } from "@/src/models/client/config";
import { db, voteCollection } from "@/src/models/name";
import { useAuthStore } from "@/src/store/Auth";
import { Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import slugify from "@/src/utils/slugify";
import Link from "next/link";

export interface Vote extends Models.Document {
  type: "question" | "answer";
  typeId: string;
  voteStatus: "upvoted" | "downvoted";
  question?: {
    $id: string;
    title: string;
  };
}

export default function VoteButtons({
  votes,
  type,
  typeId,
}: {
  votes: number;
  type: "question" | "answer";
  typeId: string;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [totalVote, setTotalVote] = useState<number>(0);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    (async () => {
      if (user && type && typeId) {
        const response = await databases.listDocuments(db, voteCollection, [
          Query.equal("type", type),
          Query.equal("typeId", typeId),
          Query.equal("votedById", user.$id),
        ]);
        const vote =
          response.documents[0]?.voteStatus === "upvoted"
            ? "up"
            : response.documents[0]?.voteStatus === "downvoted"
              ? "down"
              : null;
        setVoted(() => vote || null);
      }
    })();
  }, [user, type, typeId]);

  useEffect(() => {
    setTotalVote(votes);
  }, [votes]);

  const handleVote = async (voteStatus: "upvoted" | "downvoted") => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (isVoting) {
      return;
    }
    setIsVoting(true);
    let nextVote: "up" | "down" | null = voted;
    let delta = 0;

    if (voteStatus === "upvoted") {
      if (voted === "up") {
        nextVote = null;
        delta = -1;
      } else if (voted === "down") {
        nextVote = "up";
        delta = +2;
      } else {
        nextVote = "up";
        delta = +1;
      }
    } else if (voteStatus === "downvoted") {
      if (voted === "down") {
        nextVote = null;
        delta = +1;
      } else if (voted === "up") {
        nextVote = "down";
        delta = -2;
      } else {
        nextVote = "down";
        delta = -1;
      }
    }

    setVoted(nextVote);
    setTotalVote((prev) => prev + delta);

    try {
      const res = await axios.post("/api/vote", {
        votedById: user.$id,
        voteStatus,
        type,
        typeId,
      });
      setTotalVote(res.data.votes.score); // sync with server
    } catch (err) {
      console.error(err);
      setTotalVote((prev) => prev - delta);
      setVoted(voted); // rollback to old state
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => handleVote("upvoted")}
        className={`p-2 rounded-lg border transition-all ${
          voted === "up"
            ? "border-rose-500 bg-rose-500/20 text-rose-500"
            : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-rose-500 hover:text-rose-500"
        }`}
      >
        <ThumbsUp className="w-5 h-5" />
      </button>
      <span className="text-lg font-bold text-gray-900 dark:text-white">
        {totalVote}
      </span>
      <button
        onClick={() => handleVote("downvoted")}
        className={`p-2 rounded-lg border transition-all ${
          voted === "down"
            ? "border-rose-500 bg-rose-500/20 text-rose-500"
            : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-rose-500 hover:text-rose-500"
        }`}
      >
        <ThumbsDown className="w-5 h-5" />
      </button>
    </div>
  );
}

export function VoteCard({ vote }: { vote: Vote }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-8 h-8 rounded flex items-center justify-center ${
            vote.voteStatus === "upvoted"
              ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
          }`}
        >
          {vote.voteStatus === "upvoted" ? "▲" : "▼"}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Voted on {vote.type}
          </p>
          <Link
            href={`/questions/${vote?.question?.$id}/${slugify(vote?.question?.title!)}`}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400">
              {vote?.question?.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            {convertDateToRelativeTime(new Date(vote.$updatedAt))}
          </p>
        </div>
      </div>
    </div>
  );
}

export function VoteCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-8 h-8 rounded bg-gray-200 dark:bg-gray-700"></div>

        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>

          <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>

          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
