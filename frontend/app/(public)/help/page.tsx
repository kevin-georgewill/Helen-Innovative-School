import {
  HelpCircle,
  BookOpen,
  Clock,
  Award,
  Globe,
  Mail,
} from "lucide-react";

const faqs = [
  {
    icon: BookOpen,
    question: "How do I enroll?",
    answer:
      "Browse our courses, choose a program and complete the online application process.",
  },
  {
    icon: Globe,
    question: "Can I study online?",
    answer:
      "Yes. Helen Innovative School offers physical, virtual and hybrid learning options.",
  },
  {
    icon: Clock,
    question: "How long are the programs?",
    answer:
      "Programs range from 2-week express courses to 12-month diploma programs.",
  },
  {
    icon: Award,
    question: "Will I receive a certificate?",
    answer:
      "Yes. Learners receive certificates or diplomas upon successful completion.",
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-20 pb-24">

      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-center text-white">

        <HelpCircle className="mx-auto h-16 w-16" />

        <h1 className="mt-6 text-5xl font-bold">
          Help Centre
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
          Find answers to common questions about admissions, learning,
          certificates and student support.
        </p>

      </section>

      <section className="mx-auto max-w-6xl px-6">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="grid gap-8 md:grid-cols-2">

          {faqs.map((faq) => {
            const Icon = faq.icon;

            return (
              <div
                key={faq.question}
                className="rounded-3xl border bg-white p-8 shadow-sm"
              >
                <Icon className="mb-4 h-10 w-10 text-blue-700" />

                <h3 className="text-xl font-bold">
                  {faq.question}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {faq.answer}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      <section className="bg-blue-900 py-16 text-center text-white">

        <Mail className="mx-auto h-12 w-12" />

        <h2 className="mt-5 text-4xl font-bold">
          Still Need Help?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
          Our team is ready to assist you with admissions, courses and general enquiries.
        </p>

        <button className="mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-blue-900 transition hover:bg-gray-100">
          Contact Support
        </button>

      </section>

    </div>
  );
}