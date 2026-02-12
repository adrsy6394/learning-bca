import React, { useContext } from "react";
import {
  Brain,
  Languages,
  Volume2,
  CreditCard,
  TrendingUp,
  FileText,
} from "lucide-react";
import Button from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";

import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="my-36 mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-white transition-all duration-300">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              {user?.full_name}!
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Your AI-powered learning companion for mastering BCA concepts. Get
            personalized explanations in your preferred language.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button className="shadow-xl " onClick={() => navigate("/learning")}>
            <Card className=" dark:bg-gradient-to-r from-indigo-600 to-purple-600  dark:text-white border border-gray-200 rounded hover:scale-y-105  transition-scale duration-300">
              <CardHeader>
                <Brain className="w-8 h-8 text-indigo-600 mb-2 sm:ml-80 md:ml-44 lg:ml-52 ml-52 dark:text-pink-600" />
                <CardTitle>AI-Powered Learning</CardTitle>
                <CardDescription className="text-gray-300">
                  Get simplified explanations for complex BCA topics
                </CardDescription>
              </CardHeader>
            </Card>
          </button>

          <button className="shadow-xl" onClick={() => navigate("/learning")}>
            <Card className=" dark:bg-gradient-to-r from-indigo-600 to-purple-600  dark:text-white border border-gray-200 rounded hover:scale-y-105  transition-scale duration-300">
              <CardHeader>
                <Languages className="w-8 h-8 text-green-600 ml-52 mb-2 sm:ml-80 md:ml-44 lg:ml-52" />
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription className="text-gray-300">
                  Learn in English, Hindi, or Hinglish
                </CardDescription>
              </CardHeader>
            </Card>
          </button>

          <button className="shadow-xl" onClick={() => navigate("/learning")}>
            <Card className=" dark:bg-gradient-to-r from-indigo-600 to-purple-600  dark:text-white border border-gray-200 rounded hover:scale-y-105  transition-scale duration-300">
              <CardHeader>
                <Volume2 className="w-8 h-8 dark:text-yellow-300 text-blue-600 ml-52 mb-2 sm:ml-80 md:ml-44 lg:ml-52" />
                <CardTitle>Text-to-Speech</CardTitle>
                <CardDescription className="text-gray-300">
                  Listen to explanations for better retention
                </CardDescription>
              </CardHeader>
            </Card>
          </button>

          <button className="shadow-xl" onClick={() => navigate("/flashcards")}>
            <Card className=" dark:bg-gradient-to-r from-indigo-600 to-purple-600  dark:text-white border border-gray-200 rounded hover:scale-y-105  transition-scale duration-300">
              <CardHeader>
                <CreditCard className="w-8 h-8 text-purple-600 ml-52 mb-2 sm:ml-80 md:ml-44 lg:ml-52 dark:text-lime-400" />
                <CardTitle>Smart Flashcards</CardTitle>
                <CardDescription className="text-gray-300">
                  Quick revision cards for key concepts
                </CardDescription>
              </CardHeader>
            </Card>
          </button>

          <button className="shadow-xl" onClick={() => navigate("/progress")}>
            <Card className=" dark:bg-gradient-to-r from-indigo-600 to-purple-600  dark:text-white border border-gray-200 rounded hover:scale-y-105  transition-scale duration-300">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-orange-600 mb-2 ml-52 sm:ml-80 md:ml-44 lg:ml-52" />
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription className="text-gray-300">
                  Monitor your learning journey
                </CardDescription>
              </CardHeader>
            </Card>
          </button>

          <button className="shadow-xl" onClick={() => navigate("/learning")}>
            <Card className=" dark:bg-gradient-to-r from-indigo-600 to-purple-600  dark:text-white border border-gray-200 rounded hover:scale-y-105  transition-scale duration-300">
              <CardHeader>
                <FileText className="w-8 h-8 text-red-600 mb-2 ml-52  sm:ml-80 md:ml-44 lg:ml-52" />
                <CardTitle>PDF Export</CardTitle>
                <CardDescription className="text-gray-300">
                  Download notes for offline study
                </CardDescription>
              </CardHeader>
            </Card>
          </button>
        </div>

        {/* CTA Section */}
        <div className="shadow-xl p-8 dark:text-white text-center border border-gray-200 dark:bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">
            Ready to enhance your learning?
          </h2>
          <p className="mb-6">
            Start with AI-powered explanations or create flashcards for quick
            revision
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => navigate("/learning")}
              variant="outline"
              className="text-white border-black
            dark:border-white bg-indigo-600 dark:hover:bg-indigo-500 hover:bg-indigo-500 hover:text-white"
            >
              Start Learning
            </Button>
            <Button
              onClick={() => navigate("/progress")}
              variant="outline"
              className="text-white border-black
            dark:border-white bg-indigo-600 dark:hover:bg-indigo-500 hover:bg-indigo-500 hover:text-white"
            >
              View Progress
            </Button>
          </div>
        </div>
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-20 w-full shadow-inner  ">
          <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Team
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Mission
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Resources</h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:underline">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="https://github.com/adrsy6394" className="hover:underline">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Follow Us</h4>
              <ul className="space-y-1">
                <li>
                  <a href="https://www.instagram.com/adrsydv6388?igsh=MXEwbzJvZzM4cnRycQ==&utm_source=ig_contact_invite" className="hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/adarshyadav2006" className="hover:underline">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs py-4 border-t border-gray-300 dark:border-gray-700">
            © 2025 NexaLearn. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;
