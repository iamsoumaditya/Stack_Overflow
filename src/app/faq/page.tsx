"use client"
import React, { useState } from "react";
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageCircle,
  Award,
  Shield,
} from "lucide-react";
import Header from "@/src/components/Header";
import Contact from "@/src/components/Contact";

const faqs = [
  {
    category: "Getting Started",
    icon: HelpCircle,
    questions: [
      {
        question: "What is Queue Underflow?",
        answer:
          "Queue Underflow is a community-driven platform where developers can ask programming questions, share knowledge, and help each other solve coding problems. It's designed to be a helpful resource for developers of all skill levels.",
      },
      {
        question: "How do I create an account?",
        answer:
          'Click on the "Login" button in the top navigation, there in the top section you found a higlighted register page link. Fill in your name, email, and password. Once you verify your email, you can start asking questions and providing answers immediately.',
      },
      {
        question: "Is Queue Underflow free to use?",
        answer:
          "Yes! Queue Underflow is completely free to use. You can ask questions, provide answers, and participate in the community without any cost.",
      },
      {
        question: "How do I ask my first question?",
        answer:
          'Click the "Ask Question" button, write a clear title, provide detailed information about your problem including code examples, add relevant tags, and optionally attach an image. Make sure to search for similar questions first to avoid duplicates.',
      },
    ],
  },
  {
    category: "Asking Questions",
    icon: MessageCircle,
    questions: [
      {
        question: "What makes a good question?",
        answer:
          "A good question has a clear, specific title, includes relevant code examples, explains what you've already tried, describes the expected vs actual behavior, and uses appropriate tags. The more context you provide, the better answers you'll receive.",
      },
      {
        question: "How many tags can I add to my question?",
        answer:
          "You can add up to 5 tags per question. Choose tags that accurately describe your question's topic, programming language, framework, or technology stack.",
      },
      {
        question: "Can I edit my question after posting?",
        answer:
          "Yes! You can edit your own questions at any time. Click the edit icon below your question to make changes. It's good practice to improve your question based on feedback or to add additional information.",
      },
      {
        question: "Can I delete my question?",
        answer:
          "Yes, you can delete your own questions using the delete button. However, if your question has received answers, consider carefully whether deletion is appropriate, as it may remove valuable information for others.",
      },
      {
        question: "How do I add code to my question?",
        answer:
          "Use markdown formatting to add code. For inline code, wrap text in backticks (`code`). For code blocks, use triple backticks with optional language specification (```javascript). This ensures proper syntax highlighting.",
      },
    ],
  },
  {
    category: "Answering Questions",
    icon: MessageCircle,
    questions: [
      {
        question: "How do I answer a question?",
        answer:
          'Navigate to any question page and scroll to the "Your Answer" section at the bottom. Write your answer using the markdown editor, include code examples if relevant, and click "Post Your Answer" when ready.',
      },
      {
        question: "What is an accepted answer?",
        answer:
          'The person who asked the question can mark one answer as "accepted" by clicking the checkmark. This indicates that the answer solved their problem. Accepted answers appear at the top and give the answerer additional reputation points.',
      },
      {
        question: "Can I edit my answer?",
        answer:
          "Yes! You can edit your own answers at any time to improve them, add more information, or fix errors. Good answers often evolve based on comments and feedback.",
      },
      {
        question: "Should I answer duplicate questions?",
        answer:
          "If you find a duplicate question, it's better to flag it or comment with a link to the original question rather than answering. This helps maintain quality and prevents scattered information.",
      },
    ],
  },
  {
    category: "Reputation & Voting",
    icon: Award,
    questions: [
      {
        question: "What is reputation?",
        answer:
          "Reputation is a measure of your contributions to the community. You earn reputation points when others upvote your questions or answers, when your answer is accepted, and through other positive contributions.",
      },
      {
        question: "How do I earn reputation points?",
        answer:
          "Earn reputation by: receiving upvotes on your questions (+1 points), receiving upvotes on your answers (+1 points), having your answer accepted (+5 points), and providing helpful content to the community.",
      },
      {
        question: "How does voting work?",
        answer:
          "Users can upvote helpful questions and answers or downvote those that are unclear, incorrect, or low-quality. Your votes help surface the best content and guide other users to reliable information.",
      },
      {
        question: "Can I change my vote?",
        answer:
          "Yes, you can change your vote at any time by clicking the vote button again. Click upvote to remove an upvote, or switch between upvote and downvote as needed.",
      },
      {
        question: "Why should I upvote?",
        answer:
          'Upvoting helps identify quality content, rewards helpful contributors, and makes it easier for others to find good answers. It\'s a way to say "thank you" and improve the community.',
      },
    ],
  },
  {
    category: "Community Guidelines",
    icon: Shield,
    questions: [
      {
        question: "What content is not allowed?",
        answer:
          "Queue Overflow prohibits spam, harassment, offensive content, plagiarism, and requests for others to do your work for you. Focus on genuine technical questions and helpful, respectful answers.",
      },
      {
        question: "How should I format my posts?",
        answer:
          "Use proper grammar and punctuation, format code correctly with syntax highlighting, keep your posts focused and concise, use appropriate tags, and proofread before posting.",
      },
      {
        question: "Can I promote my own content?",
        answer:
          "You can share your own content if it's directly relevant to answering a question, but excessive self-promotion is discouraged. Always disclose when linking to your own work.",
      },
      {
        question: "How do I report inappropriate content?",
        answer:
          "If you see content that violates our guidelines, please use the flag/report button. Our moderation team will review and take appropriate action.",
      },
      {
        question: "What should I do if someone is rude?",
        answer:
          "Don't engage in arguments. Use the flag/report feature to notify moderators. Focus on the technical content and maintain a professional, helpful tone in all interactions.",
      },
    ],
  },
  {
    category: "Account & Settings",
    icon: HelpCircle,
    questions: [
      {
        question: "How do I change my profile information?",
        answer:
          'Go to your profile page and click the "Edit" button. You can update your name, change your email (with password confirmation), or change your password (with old password verification).',
      },
      {
        question: "How do I reset my password?",
        answer:
          'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link. Follow the link to create a new password.',
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can request account deletion through your profile settings. Note that your questions and answers may remain visible (anonymized) to preserve valuable community content.",
      },
      {
        question: "How do I enable dark mode?",
        answer:
          "Queue Underflow supports system-level dark mode preferences. The interface will automatically adapt to your device's dark mode settings.Otherwise you can toggle theme any mommemt through the button top right Sun/moon icon.",
      },
    ],
  },
];

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
      >
        <span className="text-base font-semibold text-gray-900 dark:text-white pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 dark:text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
 

  // Filter FAQs based on search
  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen w-full max-w-full px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Header/>
        <div className="text-center mb-12 mt-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to common questions about Queue Underflow
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-600 transition-all"
          />
        </div>

        {/* FAQ Categories */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-8">
            {filteredFaqs.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.category}>
                  <button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.category
                          ? null
                          : category.category,
                      )
                    }
                    className="flex items-center gap-3 mb-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:bg-rose-200 dark:group-hover:bg-rose-900/50 transition-all">
                      <IconComponent className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {category.category}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      ({category.questions.length})
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 dark:text-gray-400 ml-auto transition-transform duration-200 ${
                        expandedCategory === category.category
                          ? "transform rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  {(expandedCategory === category.category || searchQuery) && (
                    <div className="space-y-3">
                      {category.questions.map((faq, index) => (
                        <FAQItem
                          key={index}
                          question={faq.question}
                          answer={faq.answer}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 dark:text-gray-400">
              No FAQs found matching your search
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try adjusting your search query
            </p>
          </div>
        )}
              <Contact page={"contact"} />
      </div>
    </div>
  );
}
