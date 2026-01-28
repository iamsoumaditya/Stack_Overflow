"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import Header from "@/src/components/Header";
import { useAuthStore } from "@/src/store/Auth";
import { useRouter } from "next/navigation";
import slugify from "@/src/utils/slugify";
import { databases, storage } from "@/src/models/client/config";
import { ID } from "appwrite";
import {
  db,
  questionAttachmentBucket,
  questionCollection,
} from "@/src/models/name";
import RTE from "@/src/components/RTE";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";

interface Props {
  pageName: "Ask" | "Edit";
  questionId?: string;
  FormData: FormData | null;
}
interface FormData {
  title: string;
  content: string;
  tags: Array<string>;
  attachment?: File | null;
  attachmentId: string;
}
interface formData {
  title: string;
  content: string;
  tags: Set<string>;
  attachment?: File | null;
  attachmentId: string;
}
const LabelInputContainer = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative flex w-full flex-col space-y-2 ${className}`}>
      {children}
    </div>
  );
};

export default function QuestionForm({
  pageName,
  FormData,
  questionId,
}: Props) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [formData, setFormData] = useState<formData>({
    title: "",
    content: "",
    tags: new Set([]),
    attachment: null as File | null,
    attachmentId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const errorRef = useRef<HTMLDivElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      errorRef.current.focus();
    }
  }, [error]);

  useEffect(() => {
    if (!hydrated) return;
    if (formData?.tags) {
      const dataToSave = {
        ...formData,
        tags: Array.from(formData.tags),
      };
      if (pageName === "Edit") {
        localStorage.setItem(
          `formData-${questionId}`,
          JSON.stringify(dataToSave),
        );
        return
      }
      localStorage.setItem("formData", JSON.stringify(dataToSave));
    }
  }, [formData]);

  useEffect(() => {
    if (pageName === "Edit") {
      const res = localStorage.getItem(`formData-${questionId}`);
      let obj: formData = {
        title: "",
        content: "",
        tags: new Set([]),
        attachment: null as File | null,
        attachmentId: "",
      };
      if (res) {
        const parsed = JSON.parse(res);
        obj.title = parsed.title;
        obj.content = parsed.content;
        obj.tags = new Set(parsed.tags ?? []);
        obj.attachment = parsed?.attachment ?? (null as File | null);
        obj.attachmentId = parsed.attachmentId;
      } else if (FormData) {
        obj.title = FormData.title;
        obj.content = FormData.content;
        obj.tags = new Set(FormData.tags ?? []);
        obj.attachment = FormData?.attachment ?? (null as File | null);
        obj.attachmentId = FormData.attachmentId;
      }

      setFormData(obj);
      setHydrated(true);
      return;
    }
    const res = localStorage.getItem("formData");
    if (res) {
      const parsed = JSON.parse(res)
      setFormData({
        ...parsed,
        tags: new Set(parsed.tags ?? [])
      });
    }
    setHydrated(true);
  }, []);

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
    if (!user?.$id) {
      setError("No author found kindly login or refresh the page");
      return;
    }
    if (!formData.title || !formData.content) {
      setError("Please fill out all required fields");
      return;
    }

    if (formData.title.length > 100) {
      setError("Title must be less than 100 characters");
      return;
    }
    if (formData.title.length < 10) {
      setError("Title must be at least 10 characters");
      return;
    }

    const wordCount = formData.content.trim().split(/\s+/).length;
    if (wordCount < 10) {
      setError("Description must be at least 10 words long");
      return;
    }

    setLoading(true);
    setError("");

    const create = async () => {
      let storageResponse;
      if (formData.attachment) {
        storageResponse = await storage.createFile(
          questionAttachmentBucket,
          ID.unique(),
          formData.attachment,
        );
      }
      const response = await databases.createDocument(
        db,
        questionCollection,
        ID.unique(),
        {
          title: formData.title,
          content: formData.content,
          authorId: user?.$id,
          tags: Array.from(formData.tags),
          attachmentId:
            storageResponse !== undefined ? storageResponse.$id : null,
        },
      );

      localStorage.removeItem("formData");
      await loadConfetti();
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await wait(3000);
      return response;
    };

    const update = async () => {
      let storageResponse = undefined;
      if (formData.attachment) {
        storageResponse = await storage.createFile(
          questionAttachmentBucket,
          ID.unique(),
          formData.attachment,
        );
      }
      const response = await databases.updateDocument(
        db,
        questionCollection,
        questionId!,
        {
          title: formData.title,
          content: formData.content,
          authorId: user?.$id,
          tags: Array.from(formData.tags),
          attachmentId:
            storageResponse !== undefined
              ? storageResponse.$id
              : FormData?.attachmentId,
        },
      );
      localStorage.removeItem(`formData-${questionId}`);
      await loadConfetti();
      const wait = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      await wait(3000);
      return response;
    };

    try {
      if (pageName === "Ask") {
        const response = await create();
        router.push(`/questions/${response.$id}/${slugify(response.title)}`);
      } else {
        const response = await update();
        router.push(`/questions/${response.$id}/${slugify(response.title)}`);
      }
    } catch (error: any) {
      setError(() => error.message);
    }

    setLoading(() => false);
  };

  const addTag = () => {
    if (tag.trim().length === 0) return;
    setFormData((prev) => ({
      ...prev,
      tags: new Set([...Array.from(prev.tags), tag.trim()]),
    }));
    setTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: new Set(Array.from(prev.tags).filter((t) => t !== tagToRemove)),
    }));
  };

  const clearForm = () => {
    setFormData({
      title: "",
      content: "",
      tags: new Set(),
      attachment: null,
      attachmentId: "",
    });
    setTag("");
    setError("");
  };

  return (
    <div className="min-h-screen w-full max-w-full px-6 py-8">
      <Header />
      <div className="max-w-4xl mx-auto">
        <div className="my-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {pageName} a Question
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your knowledge and help the community by asking a clear,
            detailed question.
          </p>
        </div>

        <div className="space-y-6">
          {error && (
            <div
              ref={errorRef}
              className="p-4 rounded-lg border-2 border-red-500 dark:border-red-600"
            >
              <p className="text-center text-red-600 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          )}

          <LabelInputContainer>
            <label
              htmlFor="title"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
            >
              Title
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Be specific and imagine you're asking a question to another
              person.
            </p>
            <input
              id="title"
              name="title"
              placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
            />
          </LabelInputContainer>

          <LabelInputContainer>
            <label
              htmlFor="content"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
            >
              Explain your problem in details
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Introduce the problem and expand on what you put in the title.
              Minimum 20 characters.
            </p>
            <div
              data-color-mode={resolvedTheme}
              style={{ padding: 20 }}
              suppressHydrationWarning
            >
              <RTE
                key={resolvedTheme}
                value={formData.content}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, content: val || "" }))
                }
              />
            </div>
          </LabelInputContainer>

          <LabelInputContainer>
            <label
              htmlFor="image"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
            >
              Image (Optional)
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Add an image to your question to make it more clear and easier to
              understand.
            </p>
            <input
              id="image"
              name="image"
              accept="image/*"
              type="file"
              onChange={(e) => {
                const files = e.target.files;
                if (!files || files.length === 0) return;
                setFormData((prev) => ({
                  ...prev,
                  attachment: files[0],
                }));
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-900/30 dark:file:text-rose-400 dark:hover:file:bg-rose-900/50 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
            />
            {formData.attachment && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Selected: {formData.attachment.name}
              </p>
            )}
          </LabelInputContainer>
          {!formData.attachment && FormData && FormData.attachmentId && (
            <img
              src={storage.getFileView(
                questionAttachmentBucket,
                FormData.attachmentId,
              )}
              className="rounded-lg mb-4"
            />
          )}
          <LabelInputContainer>
            <label
              htmlFor="tag"
              className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
            >
              Tags
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Add up to 5 tags to describe what your question is about.
            </p>
            <div className="flex gap-2">
              <input
                id="tag"
                name="tag"
                placeholder="e.g. javascript, react, nodejs"
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                disabled={formData.tags.size >= 5}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all disabled:opacity-50"
              />
              <button
                onClick={addTag}
                disabled={formData.tags.size >= 5}
                className="px-6 py-3 rounded-lg bg-rose-600 dark:bg-rose-500 text-white font-semibold hover:bg-rose-700 dark:hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>

            {formData.tags.size > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {Array.from(formData.tags).map((t, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-sm font-medium border border-rose-200 dark:border-rose-800"
                  >
                    {t}
                    <button
                      onClick={() => removeTag(t)}
                      className="hover:bg-rose-200 dark:hover:bg-rose-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {formData.tags.size >= 5 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                Maximum 5 tags reached
              </p>
            )}
          </LabelInputContainer>

          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500 dark:text-rose-400" />
              Tips for a Great Question
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 dark:text-rose-400 mt-0.5">
                  •
                </span>
                <span>
                  Write a clear, specific title that describes your problem
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 dark:text-rose-400 mt-0.5">
                  •
                </span>
                <span>
                  Include all relevant code, error messages, and what you've
                  tried
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 dark:text-rose-400 mt-0.5">
                  •
                </span>
                <span>
                  Use proper formatting and grammar for better readability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 dark:text-rose-400 mt-0.5">
                  •
                </span>
                <span>Add relevant tags to help others find your question</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 bg-linear-to-r from-rose-500 to-rose-600 transition-all duration-300 ease-out group-hover:from-rose-600 group-hover:to-rose-700"></span>
              <span className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 bg-linear-to-r from-rose-400 to-rose-500 blur-xl"></span>
              <span className="relative z-10">
                {pageName === "Ask"
                  ? loading
                    ? "Publishing..."
                    : "Publish Question"
                  : loading
                    ? "Updating..."
                    : "Update Question"}
              </span>
            </button>

            <button
              onClick={clearForm}
              className="px-8 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuestionFormSkeleton() {
  return (
    <div className="min-h-screen w-full max-w-full px-6 py-8 animate-pulse">
      <div className="max-w-4xl mx-auto">
        {/* Page title */}
        <div className="my-8 space-y-3">
          <div className="h-10 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-full max-w-xl bg-gray-200 dark:bg-gray-800 rounded" />
        </div>

        <div className="space-y-6">
          {/* Title input */}
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>

          {/* Content editor */}
          <div className="space-y-2">
            <div className="h-5 w-56 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-72 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-12 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>

          {/* Existing image preview (edit mode) */}
          <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />

          {/* Tags */}
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="flex gap-2">
              <div className="h-12 flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg" />
              <div className="h-12 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            </div>

            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Tips box */}
          <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
