import React from "react";
import { Clock, CheckCircle } from "lucide-react";
import { Complaint } from "../app/users/[Id]/[name]/page";
import convertDateToRelativeTime from "../utils/relativeTime";

export default function ComplaintCard({ complaint }: {complaint:Complaint}) {

  return (
    <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 font-semibold text-sm">
            #CMP-{complaint.$id}
          </span>
          {complaint.isResolved ? (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4" />
              Resolved
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium border border-amber-200 dark:border-amber-800">
              <Clock className="w-4 h-4" />
              Under Review
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-500">
          {convertDateToRelativeTime(new Date(complaint.$createdAt))}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {complaint.subject}
      </h3>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {complaint.content}
      </p>
    </div>
  );
};