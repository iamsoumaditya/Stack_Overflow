"use client";
import { useState } from "react";

interface ConfirmDeletePropsBase {
  children: React.ReactNode;
  message?: string;
}

interface ConfirmDeleteWithArg extends ConfirmDeletePropsBase {
  arg: string;
  onConfirm: (arg: string) => Promise<void> | void;
}

interface ConfirmDeleteWithoutArg extends ConfirmDeletePropsBase {
  arg?: undefined;
  onConfirm: () => Promise<void> | void;
}

type ConfirmDeleteProps = ConfirmDeleteWithArg | ConfirmDeleteWithoutArg;


export default function ConfirmDelete({
  onConfirm,
  children,
  message,
  arg,
}: ConfirmDeleteProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = async () => {
   if (arg !== undefined) {
     await(onConfirm as (arg: string) => Promise<void> | void)(arg);
   } else {
     await(onConfirm as () => Promise<void> | void)();
   }

    setShowConfirm(false);
  };

  return (
    <>
      <span onClick={() => setShowConfirm(true)}>{children}</span>

      {showConfirm && (
        <div
          onClick={() => setShowConfirm(false)}
          className="fixed inset-0 flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            <p className="mb-4">
              {message ?? "Are you sure you want to delete this item?"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
