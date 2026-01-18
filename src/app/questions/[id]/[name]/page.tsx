"use client";
import { MarkdownPreview } from "@/src/components/RTE";
import { useTheme } from "next-themes";
import { questionAttachmentBucket } from "@/src/models/name";
import { storage } from "@/src/models/client/config";
import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Header from "@/src/components/Header";
import { useAuthStore } from "@/src/store/Auth";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";
import Link from "next/link";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import slugify from "@/src/utils/slugify";
import axios from "axios";
import {
  AddCommentButton,
  AddCommentContent,
  CommentSection,
} from "@/src/components/Comments";
import VoteButtons from "@/src/components/VoteButtons";
import Answer, { IAnswer } from "@/src/components/Answers";
import { comment } from "@/src/components/Comments";
import { Models } from "appwrite";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import ConfirmDelete from "@/src/components/ConfirmDelete";

export interface Question extends Models.Document {
  title: string;
  content: string;
  $id: string;
  $createdAt: string;
  tags: [string];
  attachmentId: string | null;
  authorId: string;
  totalVotes: number;
  totalAnswers: number;
  author: {
    name: string;
    $id: string;
  };
}

interface Data {
  question: Question;
  comments: Models.DocumentList<comment>;
  answers: Models.DocumentList<IAnswer>;
  author: {
    name: string;
    $id: string;
    prefs: {
      reputation: number;
    };
  };
  votes: number;
}

export default function QuestionDetailPage() {
  const { session, user } = useAuthStore();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const param = useParams();
  const [data, setData] = useState<Data>();
  const [comments, setComments] = React.useState<Models.DocumentList<comment>>({
    total: 0,
    documents: [],
  });
  const [answers, setAnswers] = React.useState<Models.DocumentList<IAnswer>>();
  const [question, setQuestion] = React.useState<Question>();
  const [showCommentInput, setShowCommentInput] =
    React.useState<boolean>(false);

  useEffect(() => {
    async function fetchQuestion() {
      const { data } = await axios.get(`/api/question/${param.id}`);
      setData(data);
    }
    fetchQuestion();
  }, []);

  useEffect(() => {
    if (data) {
      setComments(data.comments);
      setAnswers(data.answers);
      setQuestion(data.question);
    }
  }, [data]);

  const deleteQuestion = async () => {
    try {
      router.push("/questions");
      await axios.delete(`/api/question/${question?.$id}`);
      toast.success("Question deleted successfully!!", {
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
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong", {
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

  return (
    <div className="min-h-screen w-full max-w-full px-6 py-12">
      <div className="max-w-full mx-auto">
        <Header />
        <div className="flex items-start justify-between gap-4 my-6">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={resolvedTheme}
            transition={Bounce}
          />
          <div className="flex-1">
            {question && (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {question.title}
              </h1>
            )}
            {!question && (
              <div className="h-9 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 animate-pulse"></div>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                Asked{" "}
                {question &&
                  convertDateToRelativeTime(new Date(question.$updatedAt))}
              </span>
              <span>Answers {answers?.total}</span>
              <span>Votes {data?.votes}</span>
            </div>
          </div>

          {session && (
            <Link href="/questions/ask">
              <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
          )}
          {!session && (
            <Link href="/login">
              <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Ask a question
                </span>
              </ShimmerButton>
            </Link>
          )}
        </div>

        <hr className="my-6 border-gray-200 dark:border-gray-800" />

        {/* Question Content */}
        <div className="flex gap-6">
          {/* Vote Buttons & Actions */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            {data && question && (
              <VoteButtons
                votes={data.votes}
                type="question"
                typeId={question.$id}
              />
            )}

            {user?.$id === data?.question.authorId && (
              <>
                <Link href={`/questions/${question?.$id}/edit`}>
                  <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-rose-500 hover:text-rose-500 transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                </Link>
                <ConfirmDelete
                  onConfirm={deleteQuestion}
                  message="Are you sure you want to delete this question?"
                >
                  <button
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 
               text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </ConfirmDelete>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div
              suppressHydrationWarning
              data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 mb-4"
            >
              {question && (
                <MarkdownPreview
                  data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
                  source={question.content}
                />
              )}
              {!question && (
                <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 mb-4">
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              )}
            </div>
            {question && question.attachmentId && (
              <img
                src={storage.getFileView(
                  questionAttachmentBucket,
                  question.attachmentId,
                )}
                alt={data?.question.title}
                className="rounded-lg mb-4"
              />
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {question &&
                question?.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-sm font-medium hover:bg-rose-200 dark:hover:bg-rose-900/50 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              {!question && (
                <div className="flex flex-wrap gap-2 animate-pulse">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <AddCommentButton setShowCommentInput={setShowCommentInput} />

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-rose-500 flex items-center justify-center text-white text-sm font-semibold">
                  {data?.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-sm">
                  {data && (
                    <Link
                      href={`/users/${data.author.$id}/${slugify(
                        data.author.name,
                      )}`}
                    >
                      <p className="text-rose-600 dark:text-rose-400 font-medium hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer">
                        {data?.author.name}
                      </p>
                    </Link>
                  )}
                  {!data && (
                    <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">
                    <strong>{data?.author.prefs.reputation}</strong> reputation
                  </p>
                </div>
              </div>
            </div>
            {question && (
              <AddCommentContent
                showCommentInput={showCommentInput}
                setShowCommentInput={setShowCommentInput}
                type={"question"}
                typeId={question.$id}
                setComments={setComments}
              />
            )}

            {comments && comments?.total > 0 && (
              <CommentSection setComments={setComments} comments={comments} />
            )}

            <hr className="my-6 border-gray-200 dark:border-gray-800" />

            {question && answers ? (
              <Answer
                answers={answers}
                questionId={question.$id}
                questionAuthorId={question.authorId}
              />
            ) : (
              <div className="space-y-4 animate-pulse">
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-4 w-2/5 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>

                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
