// Faculties listing page — /faculties
// Fetches: GET /api/v1/faculties
// Renders a grid of FacultyCard components (one per school)

import {
  Stethoscope,
  Scale,
  Landmark,
  GraduationCap,
  Wheat,
  Briefcase,
  Shield,
  Users,
  Radio,
  Church,
  Building2,
} from "lucide-react";

const faculties = [
  {
    title: "MedTech",
    icon: Stethoscope,
    description: "Healthcare powered by AI, digital health and medical innovation.",
  },
  {
    title: "LawTech",
    icon: Scale,
    description: "Modern legal practice through technology and digital justice.",
  },
  {
    title: "FinTech",
    icon: Landmark,
    description: "Digital banking, blockchain and financial innovation.",
  },
  {
    title: "EdTech",
    icon: GraduationCap,
    description: "Technology transforming teaching and learning.",
  },
  {
    title: "AgriTech",
    icon: Wheat,
    description: "Smart farming and precision agriculture solutions.",
  },
  {
    title: "Business Tech",
    icon: Briefcase,
    description: "Digital entrepreneurship and business transformation.",
  },
  {
    title: "GovTech",
    icon: Building2,
    description: "Technology for governance and public sector innovation.",
  },
  {
    title: "HRTech",
    icon: Users,
    description: "Talent management, HR analytics and workforce automation.",
  },
  {
    title: "CyberTech",
    icon: Shield,
    description: "Cybersecurity, ethical hacking and digital safety.",
  },
  {
    title: "MediaTech",
    icon: Radio,
    description: "Digital media, content creation and creative technology.",
  },
  {
    title: "FaithTech",
    icon: Church,
    description: "Technology solutions for faith and community development.",
  },
];

export default function FacultiesPage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-white">

        <div className="mx-auto max-w-6xl px-6 text-center">

          <h1 className="text-5xl font-bold">
            Schools & Faculties
          </h1>

          <p className="mt-4 text-2xl text-blue-100">
            Technology-Powered Faculties
          </p>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-blue-100">
            Every profession is evolving through technology. Discover a
            faculty designed to prepare you with practical skills, innovation
            and digital expertise for the future of work.
          </p>

        </div>

      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 text-center">

        <h2 className="text-4xl font-bold">
          Choose Your Future
        </h2>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-gray-600">
          Helen Innovative School integrates Artificial Intelligence,
          innovation and emerging technologies into every profession,
          preparing learners to lead in a rapidly changing world.
        </p>

      </section>

      {/* Faculties */}
      <section className="mx-auto max-w-7xl px-6">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {faculties.map((faculty) => {
            const Icon = faculty.icon;

            return (
              <div
                key={faculty.title}
                className="rounded-3xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-700" />
                </div>

                <h3 className="text-2xl font-bold">
                  {faculty.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {faculty.description}
                </p>

                <button className="mt-6 font-semibold text-blue-700 hover:text-blue-900">
                  Explore Faculty →
                </button>
              </div>
            );
          })}

        </div>

      </section>

      {/* Why HIS */}
      <section className="bg-gray-50 py-20">

        <div className="mx-auto max-w-6xl px-6">

          <h2 className="mb-12 text-center text-4xl font-bold">
            Why Study With Us?
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {[
              "Industry-Relevant Curriculum",
              "Technology Integrated Learning",
              "Hands-on Practical Projects",
              "Future-Ready Skills",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <p className="font-semibold">{item}</p>
              </div>
            ))}

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h2 className="text-4xl font-bold">
            Ready to Begin Your Journey?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Explore our schools, discover your passion and gain the
            practical skills needed to thrive in today's technology-driven
            world.
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
              Apply Now
            </a>

          </div>

        </div>

      </section>

    </div>
  );
}
