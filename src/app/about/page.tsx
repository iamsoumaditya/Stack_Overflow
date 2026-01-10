import React from "react";
import {
  Users,
  MessageCircle,
  Award,
  Search,
  TrendingUp,
  Shield,
} from "lucide-react";
import Header from "@/src/components/Header";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="px-6 py-16 flex flex-col items-center text-center">
        <div className="max-w-full">
          <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            About Our Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A community-driven platform where developers help each other solve
            coding problems, share knowledge, and grow together.
          </p>
        </div>
      </div>

      <div className="max-w-full mx-auto px-6 py-12">
        <section className="mb-16 flex flex-col items-center">
          <div className="max-w-full">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We believe that every developer deserves access to high-quality
              programming knowledge. Our platform connects developers of all
              skill levels to ask questions, share solutions, and learn from
              each other's experiences.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Whether you're debugging your first "Hello World" or architecting
              complex distributed systems, our community is here to support your
              journey.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-full mx-auto">
            <div className="p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Ask Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Post your programming questions with clear descriptions, code
                samples, and expected outcomes. Tag them appropriately to reach
                the right experts.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center ">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Get Answers
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Community members provide detailed answers, code examples, and
                explanations. Vote on the best answers to help others find
                solutions faster.
              </p>
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Earn Reputation
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build your reputation by asking good questions, providing
                helpful answers, and contributing positively to the community.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-full mx-auto">
            <div className="flex gap-4">
              <div className="shrink-0">
                <Search className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Powerful Search
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Find answers quickly with our advanced search that indexes
                  questions, answers, tags, and code snippets.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <TrendingUp className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Voting System
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upvote helpful content and downvote incorrect or low-quality
                  posts to maintain community standards.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <Shield className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Moderation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Community moderation ensures quality content and a respectful
                  environment for all members.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0">
                <Award className="w-6 h-6 text-rose-600 dark:text-rose-400 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Badges & Achievements
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Earn badges for positive contributions and milestones to
                  showcase your expertise and commitment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 max-w-full mx-auto p-8 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Community Guidelines
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                Be respectful:
              </span>{" "}
              Treat all community members with respect and professionalism,
              regardless of experience level.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                Stay on topic:
              </span>{" "}
              Keep questions and answers focused on programming and technical
              topics.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                Do your research:
              </span>{" "}
              Search for existing answers before posting a new question to avoid
              duplicates.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                Provide context:
              </span>{" "}
              Include relevant code, error messages, and what you've already
              tried when asking questions.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                Give quality answers:
              </span>{" "}
              Provide clear explanations, working code examples, and cite
              sources when applicable.
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">
                Accept answers:
              </span>{" "}
              Mark the answer that solved your problem to help future visitors.
            </p>
          </div>
        </section>

        <section className="text-center p-12 rounded-lg border-2 border-rose-500 dark:border-rose-600 max-w-full mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Join?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers helping each other solve problems and
            build better software.
          </p>
          <button className="bg-rose-600 dark:bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors">
            <Link href="/login">Get Started</Link>
          </button>
        </section>
      </div>
    </div>
  );
}
