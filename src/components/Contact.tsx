import React, { useEffect, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useAuthStore } from "../store/Auth";
import { databases } from "../models/client/config";
import { db,complaintCollection } from "../models/name";
import { ID } from "appwrite";

export default function Contact({ page }: { page: "contact" | "complaint" }) {
    const { resolvedTheme } = useTheme();
    const {user}= useAuthStore()
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async() => {
      
    if ( !contactForm.name || !contactForm.email ) {
      toast.error("You must be logged in to submit!!", {
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
      return;
    }if (!contactForm.subject || !contactForm.content) {
      toast.error("Please fill out all the fields", {
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
      return;
    }
    setIsSubmitting(true);
      try {
          if (!user) {
              toast.error("You must be logged in to submit!!", {
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
              return;
          }
        await databases.createDocument(db,complaintCollection,ID.unique(),{...contactForm,authorId:user.$id})
      toast.success("You will be contacted shortly", {
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
        console.log(error)
      toast.error(error.message || "Error occurred while Complaining", {
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
      setContactForm((prev)=>({...prev,subject: "", content: "" }));
      setIsSubmitting(false);
    }
    };
    useEffect(() => {
        if (user) {
            setContactForm((prev)=> ({...prev, name: user.name,email:user.email}) );
        }
    },[user])

  return (
    <div className="mt-16 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
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
      {page === "contact" && (
        <>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Still have questions?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Can't find the answer you're looking for? Contact our founder
            directly!
          </p>
        </>
      )}
      {page === "complaint" && (
        <>
          {" "}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            Report an Issue
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Found a bug or facing a problem? Let us know and we’ll look into it
            right away.
          </p>
        </>
      )}
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={contactForm.name}
            disabled={true}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all disabled:bg-gray-300 dark:disabled:bg-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={contactForm.email}
            disabled={true}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all disabled:bg-gray-300 dark:disabled:bg-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject
          </label>
          <input
            type="text"
            placeholder="Brief summary of your question"
            value={contactForm.subject}
            onChange={(e) =>
              setContactForm({ ...contactForm, subject: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Content
          </label>
          <textarea
            rows={6}
            placeholder="Describe your question or issue in detail..."
            value={contactForm.content}
            onChange={(e) =>
              setContactForm({ ...contactForm, content: e.target.value })
            }
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all resize-none"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button
            onClick={handleContactSubmit}
            disabled={isSubmitting}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg px-8 py-3 font-semibold text-white transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-linear-to-r from-rose-500 to-rose-600 transition-all duration-300 ease-out group-hover:from-rose-600 group-hover:to-rose-700"></span>
            <span className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 bg-linear-to-r from-rose-400 to-rose-500 blur-xl"></span>
            {page==="contact" &&<span className="relative z-10">
              {isSubmitting ? "Sending..." : "Send Message"}
            </span>}
            {page==="complaint" &&<span className="relative z-10">
              {isSubmitting ? "Reporting..." : "Report"}
            </span>}
          </button>
        </div>
      </div>
    </div>
  );
}
