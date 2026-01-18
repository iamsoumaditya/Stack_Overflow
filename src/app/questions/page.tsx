"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/src/components/Header";
import Link from "next/link";
import { useAuthStore } from "@/src/store/Auth";
import {
  QuestionsCard,
  QuestionsCardSkeleton,
} from "@/src/components/QuestionsCard";
import { Button } from "@/src/components/ui/Button";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";

export default function AllQuestionsPage() {
  const { resolvedTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { session } = useAuthStore();
  const [latestQuestion, setLatestQuestion] = useState<any | null>(null);
  const limit = 5;

  // useEffect(() => {
  //   async function fetchLatestQuestions() {
  //     const { data } = await axios.get("/api/question", {
  //       params: { query: searchQuery, page: currentPage, limit },
  //     });
  //       setLatestQuestion(data);
  //   }
  //   fetchLatestQuestions();
  // }, [searchQuery, currentPage]);

  useEffect(() => {
    const controller = new AbortController();

    const handler = setTimeout(async () => {
      try {
        const { data } = await axios.get("/api/question", {
          params: {
            query: searchQuery,
            page: currentPage,
            limit,
          },
          signal: controller.signal, // 👈 cancel support
        });

        setLatestQuestion(data);
      } catch (error: any) {
        if (error.name === "CanceledError") {
          // Request was cancelled – ignore silently
          return;
        }
        toast.error(error.message || "Something went wrong", {
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
        console.error(error);
      }
    }, 500); // debounce delay

    return () => {
      clearTimeout(handler); // cancel debounce
      controller.abort(); // cancel axios request
    };
  }, [searchQuery, currentPage]);

  const totalPages = Math.ceil(latestQuestion?.total / limit);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen w-full max-w-full px-6 py-8">
      <Header />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-8">
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
        <div className="relative flex-1 w-full md:max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
          />
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Questions
          <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-3">
            ({latestQuestion && latestQuestion.total}{" "}
            {latestQuestion?.total == 1 ? "question" : "questions"})
          </span>
        </h2>
      </div>
      <div className="space-y-4 mb-8">
        {!latestQuestion && <QuestionsCardSkeleton />}
        {latestQuestion &&
          latestQuestion.documents.map((question: any) => (
            <QuestionsCard
              key={question.$id}
              question={question}
              contentLimit={200}
            />
          ))}
        {!latestQuestion?.documents.length && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No questions found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent md:h-10 md:w-10"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>

          <div className="hidden gap-2 md:flex">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                className="h-10 w-10"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 md:hidden">
            {currentPage > 1 && (
              <Button
                variant="outline"
                className="h-8 w-8 text-sm bg-transparent"
                onClick={() => goToPage(1)}
              >
                1
              </Button>
            )}
            {currentPage > 2 && (
              <span className="flex items-center px-1">...</span>
            )}
            <Button variant="default" className="h-8 w-8 text-sm">
              {currentPage}
            </Button>
            {currentPage < totalPages - 1 && (
              <span className="flex items-center px-1">...</span>
            )}
            {currentPage < totalPages && (
              <Button
                variant="outline"
                className="h-8 w-8 text-sm bg-transparent"
                onClick={() => goToPage(totalPages)}
              >
                {totalPages}
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent md:h-10 md:w-10"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
