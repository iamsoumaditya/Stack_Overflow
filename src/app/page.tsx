"use client";
import Header from "@/src/components/Header";
import { InteractiveHoverButton } from "@/src/components/magicui/interactive-hover-button";
import { useAuthStore } from "@/src/store/Auth";
import Link from "next/link";
import IconCloudCircle from "../components/IconCloud";
import {
  TopContributers,
  TopContributersSkeleton,
} from "../components/TopContributers";
import axios from "axios";
import { Models } from "node-appwrite";
import { userPrefs } from "@/src/store/Auth";
import { useEffect, useState } from "react";
import {QuestionsCard,QuestionsCardSkeleton} from "@/src/components/QuestionsCard";



export default function Homepage() {
  const { session } = useAuthStore();
  const [topUser, setTopUser] = useState<Models.UserList<userPrefs> | null>(
    null
  );
  const [latestQuestion, setLatestQuestion] = useState<any|null>(null);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get("/api/user/top");
      setTopUser(data);
    }
    fetchUsers();
    async function fetchLatestQuestions() {
      const { data } = await axios.get("/api/question");
      setLatestQuestion(data);
    }
    fetchLatestQuestions();
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <div className="px-6 py-16 flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-full mb-8">
          <div className="flex-1">
            <h1
              className="text-6xl font-bold mb-4 text-gray-900 dark:text-white"
              style={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              Queue Overflow
            </h1>
            <p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              style={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              Resolve your all doubts with a great & helpful Community,
              <br />
              also don't hesitate to resolve community's doubts
            </p>
            <div className="flex gap-4">
              {session && (
                <Link href={"/questions/ask"}>
                  <InteractiveHoverButton>Ask Question</InteractiveHoverButton>
                </Link>
              )}
              {!session && (
                <>
                  <Link href={"/register"}>
                    <InteractiveHoverButton>Sign Up</InteractiveHoverButton>
                  </Link>{" "}
                  <Link href={"/login"}>
                    <InteractiveHoverButton> Login</InteractiveHoverButton>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="w-64 h-64 rounded-full flex items-center justify-center">
            <IconCloudCircle />
          </div>
        </div>
      </div>

      <div className="px-6 pb-16 w-full max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-2xl border-2 border-gray-300 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Top Contributors
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {topUser && <TopContributers topUser={topUser} />}
              {!topUser && <TopContributersSkeleton />}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border-2 border-gray-300 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Latest Questions
            </h2>
            <div className="space-y-6">
              {latestQuestion &&
                latestQuestion.documents.map((question: any) => (
                  <QuestionsCard key={question.$id} question={question} />
                ))}
              {!latestQuestion && <QuestionsCardSkeleton />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
