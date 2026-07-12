import QuizHeader from "./components/QuizHeader";
import QuizBuilder from "./components/QuizBuilder";
import QuestionList from "./components/QuestionList";
import QuizActions from "./components/QuizActions";

export default function QuizzesPage() {
  // This will eventually come from your database/API
  const questions = [
    {
      id: 1,
      text: "What is a system prompt?",
    },
    {
      id: 2,
      text: "What do you understand by algorithm?",
    },
    {
      id: 3,
      text: "Name 2 types of algorithm.",
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <QuizHeader />

      {/* Quiz Builder Form */}
      <QuizBuilder />

      {/* Questions */}
      <QuestionList questions={questions} />

      {/* Bottom Buttons */}
      <QuizActions />

    </div>
  );
}