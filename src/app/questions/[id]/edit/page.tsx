"use client";
import QuestionForm,{QuestionFormSkeleton} from "@/src/components/QuestionForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { databases } from "@/src/models/client/config";
import { db, questionCollection } from "@/src/models/name";
import { Question } from "@/src/app/questions/[id]/[name]/page";
import { Bounce, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export default function AskQuestionPage() {
  const param = useParams<{ id: string }>();
  const { resolvedTheme } = useTheme();
  const [isDataArrived, setIsDataArrived] = useState<boolean>(false);
  const [questionId, setQuestionId] = useState<string>("");
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    tags: string[];
    attachmentId: string;
  }>({
    title: "",
    content: "",
    tags: [""],
    attachmentId: "",
  });

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const question = await databases.getDocument<Question>(
          db,
          questionCollection,
          param.id
        );
        setFormData({
          title: question.title,
          content: question.content,
          tags: question.tags,
          attachmentId: question.attachmentId ?? "",
        });
        setQuestionId(question.$id)
        setIsDataArrived(true);
      } catch (error) {
        console.error("Failed to fetch question", error);
      }
    }
    fetchQuestion();
  }, [param.id]);

  return isDataArrived ? (
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
      <QuestionForm
        pageName={"Edit"}
        FormData={formData}
        questionId={questionId}
      />
    </>
  ) : (
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
      <QuestionFormSkeleton />
    </>
  );
}
