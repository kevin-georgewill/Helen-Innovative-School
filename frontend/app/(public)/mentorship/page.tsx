
"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  HeartPulse,
  Laptop,
  MessageCircle,
  Search,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";

type Mentor = {
  id: number;
  name: string;
  title: string;
  industry: string;
  category: string;
  initials: string;
  color: string;
  experience: string;
  bio: string;
  expertise: string[];
  availability: string;
};

const categories = [
  "All",
  "Technology",
  "Healthcare",
  "Finance",
  "Business",
  "Education",
];

const mentors: Mentor[] = [
  {
    id: 1,
    name: "Amara Okafor",
    title: "Senior Software Engineer",
    industry: "Technology",
    category: "Technology",
    initials: "AO",
    color: "bg-blue-100 text-blue-800",
    experience: "8+ years experience",
    bio: "Amara helps aspiring developers build strong technical foundations, grow their portfolios, and navigate software engineering careers.",
    expertise: ["Software Engineering", "Career Planning", "Web Development"],
    availability: "Career guidance and portfolio reviews",
  },
  {
    id: 2,
    name: "David Mensah",
    title: "Digital Finance Consultant",
    industry: "Financial Technology",
    category: "Finance",
    initials: "DM",
    color: "bg-emerald-100 text-emerald-800",
    experience: "10+ years experience",
    bio: "David shares practical insights on financial technology, digital payments, and building a career in the fintech industry.",
    expertise: ["FinTech", "Digital Payments", "Product Strategy"],
    availability: "Career guidance and industry insights",
  },
  {
    id: 3,
    name: "Dr. Zainab Bello",
    title: "Healthcare Innovation Specialist",
    industry: "Healthcare Technology",
    category: "Healthcare",
    initials: "ZB",
    color: "bg-rose-100 text-rose-800",
    experience: "9+ years experience",
    bio: "Zainab explores how digital tools, data, and emerging technologies can improve healthcare delivery and professional practice.",
    expertise: ["HealthTech", "Digital Health", "Innovation"],
    availability: "Professional development guidance",
  },
  {
    id: 4,
    name: "Kwame Asante",
    title: "Business Growth Strategist",
    industry: "Business",
    category: "Business",
    initials: "KA",
    color: "bg-amber-100 text-amber-800",
    experience: "12+ years experience",
    bio: "Kwame supports aspiring entrepreneurs and professionals with business planning, growth strategy, and leadership development.",
    expertise: ["Entrepreneurship", "Leadership", "Business Strategy"],
    availability: "Business guidance and leadership development",
  },
  {
    id: 5,
    name: "Njeri Wanjiku",
    title: "Learning Technology Consultant",
    industry: "Education",
    category: "Education",
    initials: "NW",
    color: "bg-violet-100 text-violet-800",
    experience: "7+ years experience",
    bio: "Njeri helps educators and learning professionals explore educational technology, digital learning, and modern teaching methods.",
    expertise: ["EdTech", "Digital Learning", "Instructional Design"],
    availability: "Teaching and career development guidance",
  },
  {
    id: 6,
    name: "Chidi Eze",
    title: "Product Manager",
    industry: "Technology",
    category: "Technology",
    initials: "CE",
    color: "bg-cyan-100 text-cyan-800",
    experience: "6+ years experience",
    bio: "Chidi shares practical approaches to product thinking, cross-functional collaboration, and launching digital products.",
    expertise: ["Product Management", "UX Strategy", "Agile"],
    availability: "Product career guidance and interview preparation",
  },
];

export default function MentorshipPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requestMentor, setRequestMentor] = useState<Mentor | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [learnerEmail, setLearnerEmail] = useState("");
  const [learnerGoal, setLearnerGoal] = useState("");

  const filteredMentors = useMemo(() => {
    const term = search.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const matchesCategory =
        category === "All" || mentor.category === category;

      const matchesSearch =
        !term ||
        [
          mentor.name,
          mentor.title,
          mentor.industry,
          mentor.bio,
          ...mentor.expertise,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  function openRequest(mentor: Mentor) {
    setSelectedMentor(null);
    setRequestMentor(mentor);
    setSubmitted(false);
    setLearnerName("");
    setLearnerEmail("");
    setLearnerGoal("");
  }

  function closeModals() {
    setSelectedMentor(null);
    setRequestMentor(null);
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="space-y-20 pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
            <Sparkles className="h-4 w-4" />
            Learn from experience
          </span>

          <h1 className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your Growth.
            <br />
            Guided by Experience.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            Connect with experienced professionals who can help you navigate
            your career, strengthen your skills, and turn your ambitions into
            achievable goals.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#mentors"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Explore Mentors
              <ArrowRight className="h-5 w-5" />
            </a>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Courses
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Professional guidance
            </span>
            <span className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Career development
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Lifelong learning
            </span>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            About the program
          </span>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            You don&apos;t have to figure it all out alone.
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            At Helen Innovative School, we believe learning goes beyond the
            classroom. Mentorship offers an opportunity to learn from people
            who have navigated the challenges, made the decisions, and gained
            the experience you are working towards.
          </p>

          <p className="mt-4 leading-8 text-gray-600">
            Whether you are starting a career, changing fields, or building a
            business, the right guidance can help you move forward with
            greater clarity and confidence.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: BriefcaseBusiness,
              title: "Career direction",
              description: "Explore career paths and make informed decisions.",
            },
            {
              icon: BookOpen,
              title: "Practical insights",
              description: "Learn from real-world professional experience.",
            },
            {
              icon: Target,
              title: "Personal growth",
              description: "Set meaningful goals and build confidence.",
            },
            {
              icon: HeartPulse,
              title: "Professional support",
              description: "Get guidance as you navigate new challenges.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mentor directory */}
      <section id="mentors" className="scroll-mt-24 bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Meet the mentors
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Guidance from people who&apos;ve been there
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              Explore example mentor profiles across different professions
              and find the kind of guidance that matches your ambitions.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mt-10 max-w-xl">
            <label htmlFor="mentor-search" className="sr-only">
              Search mentors
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-blue-500">
              <Search className="h-5 w-5 shrink-0 text-gray-400" />
              <input
                id="mentor-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, industry or expertise..."
                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  category === item
                    ? "border-blue-800 bg-blue-800 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mb-5 mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {filteredMentors.length}
              </span>{" "}
              {filteredMentors.length === 1 ? "mentor" : "mentors"} found
            </p>
            <span className="text-xs text-gray-500">
              Sample profiles for demonstration
            </span>
          </div>

          {/* Cards */}
          {filteredMentors.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMentors.map((mentor) => (
                <article
                  key={mentor.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${mentor.color}`}
                    >
                      {mentor.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900">
                        {mentor.name}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-gray-600">
                        {mentor.title}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
                        {mentor.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
                    <Award className="h-4 w-4 text-blue-700" />
                    {mentor.experience}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-6 text-gray-600">
                    {mentor.bio}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {mentor.expertise.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-xs text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="rounded-lg border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => openRequest(mentor)}
                      className="rounded-lg bg-blue-800 px-3 py-3 text-sm font-semibold text-white transition hover:bg-blue-900"
                    >
                      Request Mentorship
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
              <Search className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-4 font-semibold text-gray-900">
                No mentors found
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Try another search term or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
                className="mt-5 font-semibold text-blue-800 hover:text-blue-950"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            How mentorship works
          </h2>
          <p className="mt-4 text-gray-600">
            A simple path towards more intentional professional growth.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Explore",
              description:
                "Discover mentors whose professional experience aligns with your interests.",
            },
            {
              number: "02",
              title: "Share your goals",
              description:
                "Tell us what you hope to learn and where you would value guidance.",
            },
            {
              number: "03",
              title: "Grow",
              description:
                "Use mentorship to work towards your professional and personal goals.",
            },
          ].map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-800">
                {step.number}
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="mx-auto mt-3 max-w-sm leading-7 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-14 text-center text-white sm:mx-auto sm:max-w-6xl sm:px-12">
        <div className="mx-auto max-w-3xl">
          <GraduationCap className="mx-auto h-12 w-12" />

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Your next chapter starts with the right guidance.
          </h2>

          <p className="mt-4 leading-7 text-blue-100">
            Keep learning, discover new possibilities, and take the next step
            in your professional journey with Helen Innovative School.
          </p>

          <Link
            href="/courses"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-blue-900 transition hover:bg-blue-50"
          >
            Explore Our Courses
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Mentor profile modal */}
      {selectedMentor && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-gray-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMentor(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentor-profile-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold ${selectedMentor.color}`}
                >
                  {selectedMentor.initials}
                </div>
                <div>
                  <h2
                    id="mentor-profile-title"
                    className="text-xl font-bold text-gray-900"
                  >
                    {selectedMentor.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedMentor.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                aria-label="Close profile"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <p className="leading-7 text-gray-600">
                {selectedMentor.bio}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="h-4 w-4 text-blue-700" />
                {selectedMentor.experience}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-blue-700" />
                {selectedMentor.availability}
              </div>

              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Areas of expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openRequest(selectedMentor)}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-4 font-semibold text-white transition hover:bg-blue-900"
            >
              Request Mentorship
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mentorship request modal */}
      {requestMentor && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-gray-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModals();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mentorship-request-title"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-blue-800">
                  HIS Mentorship Program
                </span>
                <h2
                  id="mentorship-request-title"
                  className="mt-2 text-2xl font-bold text-gray-900"
                >
                  {submitted ? "Interest noted!" : "Request mentorship"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModals}
                aria-label="Close request form"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />

                <p className="mt-5 leading-7 text-gray-600">
                  Thank you, {learnerName}. Your demo request for{" "}
                  <strong>{requestMentor.name}</strong> has been recorded on
                  this screen.
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  This is a demonstration only. No information has been sent
                  or saved to a server.
                </p>

                <button
                  type="button"
                  onClick={closeModals}
                  className="mt-7 w-full rounded-xl bg-blue-800 px-5 py-4 font-semibold text-white hover:bg-blue-900"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    Your selected mentor
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {requestMentor.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {requestMentor.title}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="learner-name"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Your full name
                    </label>
                    <input
                      id="learner-name"
                      required
                      value={learnerName}
                      onChange={(event) => setLearnerName(event.target.value)}
                      placeholder="Enter your name"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="learner-email"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <input
                      id="learner-email"
                      type="email"
                      required
                      value={learnerEmail}
                      onChange={(event) => setLearnerEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="learner-goal"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      What would you like help with?
                    </label>
                    <textarea
                      id="learner-goal"
                      required
                      rows={3}
                      value={learnerGoal}
                      onChange={(event) => setLearnerGoal(event.target.value)}
                      placeholder="Tell us about your goals..."
                      className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-4 font-semibold text-white transition hover:bg-blue-900"
                  >
                    Submit Demo Request
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <p className="text-center text-xs leading-5 text-gray-500">
                    Demo only. This form does not send or store personal
                    information.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
