// Events listing page — /events
// Fetches: GET /api/v1/events
// Groups events by type: Webinars, Workshops, Competitions, Challenges
// Register button calls POST /api/v1/events/:id/register (requires auth)

import {
  Calendar,
  Monitor,
  Wrench,
  Trophy,
  Users,
} from "lucide-react";

const events = [
  {
    title: "AI for Healthcare Webinar",
    type: "Webinar",
    date: "Aug 15, 2026",
    location: "Online",
  },
  {
    title: "Software Development Bootcamp",
    type: "Workshop",
    date: "Sept 5, 2026",
    location: "Campus",
  },
  {
    title: "Helen Innovation Challenge",
    type: "Competition",
    date: "Oct 10, 2026",
    location: "Hybrid",
  },
];

const categories = [
  {
    title: "Webinars",
    icon: Monitor,
    description: "Live sessions with industry experts.",
  },
  {
    title: "Workshops",
    icon: Wrench,
    description: "Hands-on practical learning experiences.",
  },
  {
    title: "Competitions",
    icon: Trophy,
    description: "Innovation challenges and hackathons.",
  },
  {
    title: "Networking",
    icon: Users,
    description: "Meet professionals and fellow innovators.",
  },
];

export default function EventsPage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-white">

        <div className="mx-auto max-w-6xl px-6 text-center">

          <h1 className="text-5xl font-bold">
            Events & Community
          </h1>

          <p className="mt-4 text-2xl text-blue-100">
            Learn. Connect. Innovate.
          </p>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-blue-100">
            Join webinars, workshops, competitions and networking events
            designed to help you gain practical skills and connect with
            professionals shaping the future.
          </p>

        </div>

      </section>

      {/* Upcoming Events */}
      <section className="mx-auto max-w-7xl px-6">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Upcoming Events
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {events.map((event) => (
            <div
              key={event.title}
              className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                {event.type}
              </span>

              <h3 className="mt-5 text-2xl font-bold">
                {event.title}
              </h3>

              <div className="mt-5 flex items-center gap-2 text-gray-500">
                <Calendar size={18} />
                <span>{event.date}</span>
              </div>

              <p className="mt-2 text-gray-500">
                {event.location}
              </p>

              <button className="mt-6 rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800">
                Register
              </button>
            </div>
          ))}

        </div>

      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-20">

        <div className="mx-auto max-w-6xl px-6">

          <h2 className="mb-10 text-center text-4xl font-bold">
            Event Categories
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.title}
                  className="rounded-3xl bg-white p-8 text-center shadow-sm"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <Icon className="h-7 w-7 text-blue-700" />
                  </div>

                  <h3 className="text-xl font-bold">
                    {category.title}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {category.description}
                  </p>
                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-4xl font-bold">
            Join Our Next Event
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Be part of a growing community of learners, innovators and
            professionals building the future with technology.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <a
              href="/courses"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-900 hover:bg-gray-100"
            >
              Explore Courses
            </a>

            <a
              href="/register"
              className="rounded-xl border border-white px-8 py-4 font-semibold hover:bg-white hover:text-blue-900"
            >
              Register Now
            </a>

          </div>

        </div>

      </section>

    </div>
  );
}
