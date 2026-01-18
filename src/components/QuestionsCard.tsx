import convertDateToRelativeTime from "@/src/utils/relativeTime";
import Link from "next/link";
import slugify from "../utils/slugify";
import { MarkdownPreview } from "@/src/components/RTE";
import { useTheme } from "next-themes";
import { Question } from "../app/questions/[id]/[name]/page";

export function QuestionsCard({
  question,
  contentLimit = 100,
}: {
  question: Question;
  contentLimit?: number;
}) {
  const { resolvedTheme } = useTheme();

  function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <div
      data-color-mode={resolvedTheme}
      className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-200 cursor-pointer"
    >
      <Link href={`questions/${question.$id}/${slugify(question.title)}`}>
        <h3 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-rose-600 dark:hover:text-rose-400">
          {question.title}
        </h3>
      </Link>

      <MarkdownPreview
        source={truncateText(question.content, contentLimit)}
        className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
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
                d="M5 15l7-7 7 7"
              />
            </svg>
            {question.totalVotes}
          </span>
          <span className="flex items-center gap-1">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {question.totalAnswers}
          </span>
        </div>
        <div
          className="text-gray-500 dark:text-gray-500 text-xs"
          suppressHydrationWarning
        >
          <Link
            href={`users/${question.author.$id}/${slugify(
              question.author.name,
            )}`}
          >
            {question.author.name}
          </Link>{" "}
          • {convertDateToRelativeTime(new Date(question.$updatedAt))}
        </div>
      </div>
    </div>
  );
}

export function QuestionsCardSkeleton({ length = 5 }: { length?: number }) {
  const placeholders = Array.from({ length: length });

  return (
    <div className="space-y-4">
      {placeholders.map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 transition-all duration-200 cursor-pointer"
        >
          <div className="h-6 w-3/4 mb-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

          <div className="space-y-2 mb-4">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <span
                key={j}
                className="px-6 py-2 text-xs font-medium bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuestionsProfileCard({ question }: { question: Question }) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-200 cursor-pointer">
      <Link href={`/questions/${question.$id}/${slugify(question.title)}`}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-rose-600 dark:hover:text-rose-400">
          {question.title}
        </h3>
      </Link>

      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <span className="flex items-center gap-1">
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
                d="M5 15l7-7 7 7"
              />
            </svg>
            {question.totalVotes}
          </span>
          <span className="flex items-center gap-1">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            {question.totalAnswers}
          </span>
        </div>
        <div
          className="text-gray-500 dark:text-gray-500 text-xs"
          suppressHydrationWarning
        >
          {convertDateToRelativeTime(new Date(question.$updatedAt))}
        </div>
      </div>
    </div>
  );
}