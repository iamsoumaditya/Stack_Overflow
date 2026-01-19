import convertDateToRelativeTime from "@/src/utils/relativeTime";
import { Models } from "node-appwrite";
import { userPrefs } from "@/src/store/Auth";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";
import slugify from "../utils/slugify";

export function TopContributers({
  topUser,
}: {
  topUser: Models.UserList<userPrefs>;
}) {
  return (
    <>
      {topUser.users.map((user) => (
        <figure
          key={user.$id}
          className="relative mx-auto min-h-fit w-full transform cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
        >
          <div className="flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex flex-col overflow-hidden">
              <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                <Link href={`/users/${user.$id}/${slugify(user.name)}`}>
                  <span className="text-sm sm:text-lg hover:underline">{user.name}</span>
                </Link>
                <span className="mx-1">·</span>
                <span className="text-xs text-gray-500">
                  {convertDateToRelativeTime(new Date(user.$updatedAt))}
                </span>
              </figcaption>
              <p className="text-sm font-normal dark:text-white/60">
                <span>Reputation</span>
                <span className="mx-1">·</span>
                <span className="text-xs text-gray-500">
                  {user.prefs.reputation}
                </span>
              </p>
            </div>
          </div>
        </figure>
      ))}
    </>
  );
}

export function TopContributersSkeleton() {
  const placeholders = Array.from({ length: 10 });

  return (
    <>
      {placeholders.map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  );
}