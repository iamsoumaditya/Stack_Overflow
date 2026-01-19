"use client";

import QuestionForm from "@/src/components/QuestionForm";
import { Bounce, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";
export default function AskQuestionPage() {
  const { resolvedTheme } = useTheme();
  return (
    <>
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
      <QuestionForm pageName={"Ask"} FormData={null} />
    </>
  );
}
