import RTE, { MarkdownPreview } from "@/src/components/RTE";
import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { Trash2, Check, X } from "lucide-react";
import { useAuthStore } from "@/src/store/Auth";
import Link from "next/link";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import axios from "axios";
import {
  AddCommentButton,
  AddCommentContent,
  CommentSection,
  comment,
} from "@/src/components/Comments";
import VoteButtons from "@/src/components/VoteButtons";
import { Models } from "appwrite";
import confetti from "canvas-confetti";
import slugify from "@/src/utils/slugify";
import ConfirmDelete from "@/src/components/ConfirmDelete";
import { Question } from "../app/questions/[id]/[name]/page";
import { Bounce, ToastContainer, toast } from "react-toastify";

export interface IAnswer extends Models.Document {
  questionId: string;
  content: string;
  comments: Models.DocumentList<comment>;
  totalVotes: number;
  authorId: string;
  isAccepted: boolean;
  author: {
    name: string;
    reputation: number;
  };
  question?: Question;
  totalvotes?: Number;
}

export function AnswerCard({
  answer,
  deleteAnswer,
  questionAuthorId,
  isAccepted,
  setIsAccepted,
  acceptedId,
  setAcceptedId,
}: {
  answer: IAnswer;
  deleteAnswer: (answerId: string) => Promise<void>;
  questionAuthorId: string;
  isAccepted: Boolean;
  setIsAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  acceptedId: string;
  setAcceptedId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { user } = useAuthStore();
  const { resolvedTheme } = useTheme();
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<Models.DocumentList<comment>>(
    answer.comments,
  );

  const acceptAnswer = async (answerId: string) => {
    setIsAccepted((prev) => !prev);
    answer.isAccepted = !answer.isAccepted;
    try {
      await axios.patch("/api/answer", { answerId });
    } catch (error) {
      console.log(error);
      answer.isAccepted = !answer.isAccepted;
      setIsAccepted((prev) => !prev);
    }
    setAcceptedId((prev) => (prev === answerId ? "" : answerId));
  };
  return (
    <div
      id={`answer-${answer.$id}`}
      className="py-6 px-4 border rounded-lg border-gray-200 dark:border-gray-800 mb-6"
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-4 shrink-0">
          <VoteButtons
            votes={answer.totalVotes}
            type={"answer"}
            typeId={answer.$id}
          />

          {user?.$id === answer.authorId && (
            <ConfirmDelete
              onConfirm={deleteAnswer}
              message="Are you sure you want to delete this Answer?"
              arg={answer.$id}
            >
              <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-700  text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </ConfirmDelete>
          )}
          {!isAccepted && user?.$id === questionAuthorId && (
            <button
              onClick={() => acceptAnswer(answer.$id)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500 transition-all"
            >
              <Check className="w-5 h-5" />
            </button>
          )}
          {isAccepted &&
            user?.$id === questionAuthorId &&
            answer.$id === acceptedId && (
              <button
                onClick={() => acceptAnswer(answer.$id)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            )}
        </div>
        <div data-color-mode={resolvedTheme} className="flex-1">
          {answer.isAccepted && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
              ✓ Accepted Answer
            </div>
          )}

          <MarkdownPreview source={answer.content} />

          <div className="mt-4 flex items-center justify-between">
            <AddCommentButton setShowCommentInput={setShowComments} />

            <div className="flex items-center gap-2 mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Answered{" "}
                {convertDateToRelativeTime(new Date(answer.$createdAt))}
              </p>
              <div className="w-9 h-9 rounded-lg bg-rose-500 flex items-center justify-center text-white text-sm font-semibold">
                {answer.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>

              <div className="text-sm">
                <Link
                  href={`/users/${answer.authorId}/${slugify(
                    answer.author.name,
                  )}`}
                >
                  <p className="text-rose-600 dark:text-rose-400 font-medium hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer">
                    {answer.author.name}
                  </p>
                </Link>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>{answer.author.reputation}</strong> reputation
                </p>
              </div>
            </div>
          </div>

          <AddCommentContent
            showCommentInput={showComments}
            setShowCommentInput={setShowComments}
            type={"answer"}
            typeId={answer.$id}
            setComments={setComments}
          />

          {comments?.total > 0 && (
            <CommentSection setComments={setComments} comments={comments} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Answer({
  answers,
  questionId,
  questionAuthorId,
}: {
  answers: Models.DocumentList<IAnswer>;
  questionId: string;
  questionAuthorId: string;
}) {
  const { session, user } = useAuthStore();
  const { resolvedTheme } = useTheme();
  const [answer, setAnswer] = useState("");
  const [allAnswer, setAllAnswers] = useState(answers);
  const [loading, setLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [acceptedId, setAcceptedId] = useState<string>("");

  useEffect(() => {
    const isAnsAccepted = allAnswer?.documents?.some(
      (ans) => ans.isAccepted === true,
    );

    setIsAccepted(isAnsAccepted);

    const acceptedAns = allAnswer?.documents?.find((ans) => ans.isAccepted);

    if (acceptedAns) {
      setAcceptedId(acceptedAns.$id);
    } else {
      setAcceptedId("");
    }
  }, [allAnswer]);

  const loadConfetti = (timeInMS = 1000) => {
    const end = Date.now() + timeInMS;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  const handleSubmit = async () => {
    if (!answer || !user) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/answer", {
        questionId: questionId,
        answer,
        authorId: user.$id,
      });
      setAnswer(() => "");
      setAllAnswers((prev) => ({
        total: prev.total + 1,
        documents: [
          {
            ...res.data,
            author: { ...user, reputation: user.prefs.reputation },
            upvotesDocuments: { documents: [], total: 0 },
            downvotesDocuments: { documents: [], total: 0 },
            totalVotes: 0,
            comments: { documents: [], total: 0 },
          },
          ...prev.documents,
        ],
      }));

      await loadConfetti();
    } catch (error: any) {
      toast.error(error?.message || "Error creating answer", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: resolvedTheme === "dark" ? "dark" : "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnswer = async (answerId: string): Promise<void> => {
    try {
      setAllAnswers((prev) => ({
        total: prev.total - 1,
        documents: prev.documents.filter((answer) => answer.$id !== answerId),
      }));
      await axios.delete("/api/answer", {
        data: { answerId },
      });
    } catch (error: any) {
      toast.error(error?.message || "Error creating answer", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: resolvedTheme === "dark" ? "dark" : "light",
        transition: Bounce,
      });
    }
  };

  const hasAnswered = allAnswer?.documents?.some(
    (ans) => ans.authorId === user?.$id,
  );

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {allAnswer.total} {allAnswer.total === 1 ? "Answer" : "Answers"}
        </h2>

        <div>
          {allAnswer?.documents?.length ? (
            allAnswer.documents.map((answer) => (
              <AnswerCard
                key={answer.$id}
                answer={answer}
                deleteAnswer={deleteAnswer}
                questionAuthorId={questionAuthorId}
                isAccepted={isAccepted}
                setIsAccepted={setIsAccepted}
                acceptedId={acceptedId}
                setAcceptedId={setAcceptedId}
              />
            ))
          ) : (
            <p className="text-gray-500 text-xl">
              No answers yet. Be the first to contribute!
            </p>
          )}
        </div>
      </div>

      {session && user && user?.$id !== questionAuthorId && !hasAnswered && (
        <div data-color-mode={resolvedTheme} className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your Answer
          </h2>
          <RTE
            key={resolvedTheme}
            value={answer}
            onChange={(val) => setAnswer(val || "")}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-4 group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300 ease-out ${
              loading ? "bg-gray-400 cursor-not-allowed" : ""
            }}`}
          >
            {!loading && (
              <>
                <span className="absolute inset-0 bg-linear-to-r from-rose-500 to-rose-600 transition-all duration-300 ease-out group-hover:from-rose-600 group-hover:to-rose-700"></span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 bg-linear-to-r from-rose-400 to-rose-500 blur-xl"></span>
              </>
            )}
            {!loading && (
              <span className="relative z-10">Post Your Answer</span>
            )}
            {loading && (
              <span className="relative z-10">Posting Your Answer ....</span>
            )}
          </button>
        </div>
      )}
    </>
  );
}

export function ProfileAnswerCard({ answer }: { answer: IAnswer }) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link
          href={`/questions/${answer.questionId}/${slugify(answer.question?.title!)}?answer=${answer.$id}`}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400">
            {answer.question?.title}
          </h3>
        </Link>
        {answer.isAccepted && (
          <span className="shrink-0 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
            ✓ Accepted
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span>{answer.totalVotes} votes</span>
        <span className="ml-auto" suppressHydrationWarning>
          {convertDateToRelativeTime(new Date(answer.$createdAt))}
        </span>
      </div>
    </div>
  );
}

export function ProfileAnswerCardSkeleton() {
  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="ml-auto h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
