"use client";
import { account } from "@/src/models/client/config";
import React, { useEffect, useState } from "react";
import { Edit, Clock, Calendar, Eye, EyeOff, BadgeCheck } from "lucide-react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/src/components/Header";
import { Question } from "@/src/app/questions/[id]/[name]/page";
import {
  IAnswer,
  ProfileAnswerCard,
  ProfileAnswerCardSkeleton,
} from "@/src/components/Answers";
import { Models } from "appwrite";
import {
  comment,
  CommentCard,
  CommentCardSkeleton,
} from "@/src/components/Comments";
import { Data } from "@/src/app/api/user/[id]/route";
import { Vote, VoteCard, VoteCardSkeleton } from "@/src/components/VoteButtons";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import {
  QuestionsCardSkeleton,
  QuestionsProfileCard,
} from "@/src/components/QuestionsCard";
import { NumberTicker } from "@/src/components/magicui/number-ticker";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/src/store/Auth";
import env from "@/src/app/env";
import ComplaintCard from "@/src/components/Complaint";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";
export interface Complaint extends Models.Document{
  name: string;
  email: string;
  authorId: string;
  isResolved:boolean
  subject: string;
  content: string;
}
const StatCard = ({ number, label }: { number: number; label: string }) => (
  <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 text-center hover:border-rose-300 dark:hover:border-rose-700 transition-all">
    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
      <NumberTicker value={number} />
    </div>
    <div className="text-gray-600 dark:text-gray-400 text-sm">{label}</div>
  </div>
);

export default function UserProfilePage() {
  const param = useParams();
  const { resolvedTheme } = useTheme();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    "summary" | "questions" | "answers" | "votes" | "comments"|"complaints"
  >("summary");
  const [isEditing, setIsEditing] = useState(false);
  const [author, setAuthor] = useState<Models.User>();
  const [questions, setQuestion] = useState<Models.DocumentList<Question>>();
  const [answers, setAnswers] = useState<Models.DocumentList<IAnswer>>();
  const [votes, setVotes] = useState<Models.DocumentList<Vote>>();
  const [comments, setComments] = useState<Models.DocumentList<comment>>();
  const [complaints, setComplaints] = useState<Models.DocumentList<Complaint>>();
  const [newName, setNewName] = useState<string>(author?.name ?? "");
  const [newEmail, setNewEmail] = useState<string>(author?.email ?? "");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>("");
  const [editMode, setEditMode] = useState<"password" | "email" | "name">(
    "name",
  );
  const [showpassword, setShowPassword] = useState(false);
const [isSendingVerification, setIsSendingVerification] = useState(false);

const handleSendVerification = async() => {
  setIsSendingVerification(true);
  try {
    console.log(env.domain)
    await account.createVerification({
      url: `${env.domain}/verify`,
    });
    toast.success("Verification mail sent successfully!!", {
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
  } catch (error:any) {
    console.log(error)
    toast.error(error.message || "Unable to send mail", {
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
    setIsSendingVerification(false)
  }
  
};
  useEffect(() => {
    async function fetchData() {
      try {
        if (param.Id) {
          const { data } = await axios.get<Data>(`/api/user/${param.Id}`);
          setQuestion(data.questions);
          setAnswers(data.answers);
          setComments(data.comments);
          setVotes({
            total: (data.upvotes.total ?? 0) + (data.downvotes.total ?? 0),
            documents: [
              ...(data.upvotes.documents ?? []),
              ...(data.downvotes.documents ?? []),
            ],
          });
          setAuthor(data.author);
          setNewName(data.author.name);
          setNewEmail(data.author.email);
          setComplaints(data.complaints)
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.message || "Unable to get the user", {
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
    }
    fetchData();
  }, [param.Id, param.name]);

  const totalQuestions = questions?.total ?? 0;
  const totalAnswers = answers?.total ?? 0;

  const handleEdit = async () => {
    if (!author) return;

    if (editMode === "name") {
      setAuthor((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: newName,
        };
      });
      try {
        await account.updateName(newName);
        toast.success("Name updated successfully!!", {
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
        console.log(error);
        toast.error(error.message || "Name updation failed", {
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

        setAuthor((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            name: author.name,
          };
        });
      } finally {
        setIsEditing(false);
      }
    } else if (editMode === "email") {
      try {
        await account.updateEmail(newEmail, password);
        toast.success("Email updated successfully!!", {
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
        setAuthor((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            email: newEmail,
          };
        });
      } catch (error: any) {
        console.log(error);
        toast.error(error.message || "Email updation failed", {
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
        setIsEditing(false);
      }
    } else if (editMode === "password") {
      try {
        await account.updatePassword(newPassword, oldPassword);
        toast.success("Password updated successfully!!", {
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
        console.log(error);
        toast.error(error.message || "Password updation failed", {
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
        setIsEditing(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Header />
        <div className="flex items-start gap-6 mb-8">
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
          <div className="w-32 h-32 rounded-lg bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white text-5xl font-bold shrink-0">
            {author &&
              author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                {author && (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-3">
                      <span>{author.name}</span>
                      {author.labels.length === 1 && (
                        <>
                          <BadgeCheck
                            size={20}
                            color="white"
                            style={{ fill: "blue" }}
                          />
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {author.labels[0]}
                          </span>
                        </>
                      )}
                    </h1>
                  </>
                )}
                {!author && (
                  <div className="h-4 w-48 mb-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                )}
                {author && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {author.email}
                  </p>
                )}
                {!author && (
                  <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                )}
              </div>
              {user && user.$id === param.Id && (
                <div className="flex flex-row gap-3.5" suppressHydrationWarning>
                  {author && !author.emailVerification && (
                    <Tooltip>
                        <TooltipTrigger
                          onClick={handleSendVerification}
                          disabled={isSendingVerification}
                          className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-semibold border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {isSendingVerification
                            ? "Sending..."
                            : "Not Verified"}
                        </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to verify</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-rose-500 hover:text-rose-500 dark:hover:border-rose-500 dark:hover:text-rose-400 transition-all flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined{" "}
                {author &&
                  convertDateToRelativeTime(new Date(author.$createdAt))}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Last activity{" "}
                {author &&
                  convertDateToRelativeTime(new Date(author.accessedAt))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("summary")}
            className={`pb-3 px-2 text-sm font-medium transition-all ${
              activeTab === "summary"
                ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`pb-3 px-2 text-sm font-medium transition-all ${
              activeTab === "questions"
                ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            className={`pb-3 px-2 text-sm font-medium transition-all ${
              activeTab === "answers"
                ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Answers
          </button>
          <button
            onClick={() => setActiveTab("votes")}
            className={`pb-3 px-2 text-sm font-medium transition-all ${
              activeTab === "votes"
                ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Votes
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`pb-3 px-2 text-sm font-medium transition-all ${
              activeTab === "comments"
                ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`pb-3 px-2 text-sm font-medium transition-all ${
              activeTab === "complaints"
                ? "text-rose-600 dark:text-rose-400 border-b-2 border-rose-600 dark:border-rose-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Complaints
          </button>
        </div>

        <div>
          {activeTab === "summary" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  number={author?.prefs.reputation ?? 0}
                  label="Reputation"
                />
                <StatCard number={totalQuestions} label="Questions asked" />
                <StatCard number={totalAnswers} label="Answers given" />
              </div>

              {isEditing && (
                <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Edit Profile
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-6 py-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="editMode"
                          value="name"
                          checked={editMode === "name"}
                          onChange={(e) =>
                            setEditMode(
                              e.target.value as "email" | "password" | "name",
                            )
                          }
                          className="w-4 h-4 text-rose-600 focus:ring-rose-500 dark:focus:ring-rose-600"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Change Name
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="editMode"
                          value="email"
                          checked={editMode === "email"}
                          onChange={(e) =>
                            setEditMode(
                              e.target.value as "email" | "password" | "name",
                            )
                          }
                          className="w-4 h-4 text-rose-600 focus:ring-rose-500 dark:focus:ring-rose-600"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Change Email
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="editMode"
                          value="password"
                          checked={editMode === "password"}
                          onChange={(e) =>
                            setEditMode(
                              e.target.value as "email" | "password" | "name",
                            )
                          }
                          className="w-4 h-4 text-rose-600 focus:ring-rose-500 dark:focus:ring-rose-600"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Change Password
                        </span>
                      </label>
                    </div>

                    {editMode === "name" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="Enter your Name"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
                        />
                      </div>
                    )}
                    {editMode === "email" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Email
                          </label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter your New email"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <div className="relative w-full">
                            <input
                              type={showpassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your current password to confirm"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showpassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            >
                              {showpassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {editMode === "password" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Old Password
                          </label>
                          <div className="relative w-full">
                            <input
                              type={showpassword ? "text" : "password"}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="Enter your current password"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showpassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            >
                              {showpassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative w-full">
                            <input
                              type={showpassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter your new password"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showpassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                            >
                              {showpassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleEdit}
                        className="px-6 py-2 rounded-lg bg-rose-600 dark:bg-rose-500 text-white font-semibold hover:bg-rose-700 dark:hover:bg-rose-600 transition-all"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setNewName(author?.name ?? "");
                          setNewEmail(author?.email ?? "");
                          setOldPassword("");
                          setNewPassword("");
                          setPassword("");
                          setEditMode("name");
                          setIsEditing(false);
                        }}
                        className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  {questions && questions.total !== 0 && (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Recent Questions
                    </h2>
                  )}
                  <div className="space-y-3">
                    {questions &&
                      questions.documents
                        .slice(0, 3)
                        .map((q) => (
                          <QuestionsProfileCard key={q.$id} question={q} />
                        ))}
                    {!questions && <QuestionsCardSkeleton length={3} />}
                  </div>
                </div>

                <div>
                  {answers && answers.total !== 0 && (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Recent Answers
                    </h2>
                  )}
                  <div className="space-y-3">
                    {answers &&
                      answers.documents
                        .slice(0, 3)
                        .map((a) => (
                          <ProfileAnswerCard key={a.$id} answer={a} />
                        ))}
                    {!answers && <ProfileAnswerCardSkeleton />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "questions" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Questions ({totalQuestions})
              </h2>
              <div className="space-y-4">
                {questions &&
                  questions.documents.map((q) => (
                    <QuestionsProfileCard key={q.$id} question={q} />
                  ))}
              </div>
            </div>
          )}

          {activeTab === "answers" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Answers ({totalAnswers})
              </h2>
              <div className="space-y-4">
                {answers &&
                  answers.documents.map((a) => (
                    <ProfileAnswerCard key={a.$id} answer={a} />
                  ))}
                {!answers && <ProfileAnswerCardSkeleton />}
              </div>
            </div>
          )}

          {activeTab === "votes" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Votes ({votes?.total})
              </h2>
              <div className="space-y-4">
                {votes &&
                  votes.documents.map((v) => <VoteCard key={v.$id} vote={v} />)}
                {!votes && <VoteCardSkeleton />}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Comments ({comments?.total})
              </h2>
              <div className="space-y-4">
                {comments &&
                  comments.documents.map((c) => (
                    <CommentCard key={c.$id} comment={c} />
                  ))}
                {!comments && <CommentCardSkeleton />}
              </div>
            </div>
          )}
          {activeTab === "complaints" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                All Complaints ({complaints?.total})
              </h2>
              <div className="space-y-4">
                {complaints &&
                  complaints.total !== 0 &&
                  complaints.documents.map((c) => (
                    <ComplaintCard key={c.$id} complaint={c} />
                  ))}
                {complaints && complaints.total === 0 && (
                  <div className="flex items-center justify-center h-64 text-center">
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                      You haven't raised any complaints yet.
                    </p>
                  </div>
                )}
                {!complaints && <CommentCardSkeleton />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}