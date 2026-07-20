"use client";

import { useState } from "react";

import QuizHeader from "./components/QuizHeader";
import QuizBuilder from "./components/QuizBuilder";
import QuestionList, {
  Question,
} from "./components/QuestionList";
import QuizActions from "./components/QuizActions";


export default function QuizzesPage() {

  const [quiz, setQuiz] = useState({
    title: "Advanced Machine Learning",
    instructions: "Answer all questions.",
    deadline: "",
    passMark: "70",
  });



  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "What is a system prompt?",
      options: [
        "A database query",
        "An instruction given to an AI model",
        "A programming language",
        "A user password",
      ],
      correctAnswer: "An instruction given to an AI model",
    },

    {
      id: 2,
      text: "What do you understand by algorithm?",
      options: [
        "A step-by-step procedure for solving a problem",
        "A computer screen",
        "A database",
        "A browser",
      ],
      correctAnswer:
        "A step-by-step procedure for solving a problem",
    },

    {
      id: 3,
      text: "Name 2 types of algorithm.",
      options: [
        "Sorting and Searching",
        "HTML and CSS",
        "React and Node",
        "Frontend and Backend",
      ],
      correctAnswer: "Sorting and Searching",
    },
  ]);



  const handleAddQuestion = () => {
    console.log("Open Question Modal");
  };



  const handleDeleteQuestion = (id: number) => {
    setQuestions((prev) =>
      prev.filter(
        (question) => question.id !== id
      )
    );
  };



  const handleEditQuestion = (question: Question) => {
    console.log("Edit question:", question);
  };



  const handleCreateQuiz = () => {
    alert("Quiz creation started! (Demo Mode)");
  };



  const handlePublishQuiz = () => {
    console.log({
      quiz,
      questions,
    });

    alert("Quiz published successfully! (Demo Mode)");
  };



  const handleSaveDraft = () => {
    console.log({
      quiz,
      questions,
    });

    alert("Quiz saved as draft! (Demo Mode)");
  };



  return (
    <div className="space-y-8">


      <QuizHeader
        onCreateQuiz={handleCreateQuiz}
      />



      <QuizBuilder
        quiz={quiz}
        setQuiz={setQuiz}
      />



      <QuestionList
        questions={questions}
        onAddQuestion={handleAddQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onEditQuestion={handleEditQuestion}
      />



      <QuizActions
        onPublish={handlePublishQuiz}
        onSaveDraft={handleSaveDraft}
      />


    </div>
  );
}