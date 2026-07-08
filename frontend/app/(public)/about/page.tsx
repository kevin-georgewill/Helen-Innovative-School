import {
  Eye,
  Rocket,
  Lightbulb,
  GraduationCap,
  Globe,
  Users,
  Laptop,
  Target,
} from "lucide-react";

const values = [
  {
    title: "Innovation",
    description: "Driving creative thinking and technology-led solutions.",
    icon: Lightbulb,
  },
  {
    title: "Excellence",
    description: "Delivering high-quality, industry-focused education.",
    icon: GraduationCap,
  },
  {
    title: "Practical Learning",
    description: "Learning by building real-world solutions.",
    icon: Laptop,
  },
  {
    title: "Integrity",
    description: "Promoting ethical leadership and professionalism.",
    icon: Target,
  },
  {
    title: "Collaboration",
    description: "Growing through teamwork and partnerships.",
    icon: Users,
  },
  {
    title: "Lifelong Learning",
    description: "Helping learners continually grow and adapt.",
    icon: Globe,
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20">

  {/* Hero */}
  <section className="w-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-white">
    <div className="mx-auto max-w-6xl px-8 text-center">
      <h1 className="text-5xl font-bold">
        Helen Innovative School
      </h1>

      <p className="mt-4 text-2xl text-blue-100">
        Where Every Profession Meets Innovation
      </p>

      <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-blue-100">
        Helen Innovative School equips students, professionals,
        entrepreneurs and organizations with practical technology,
        innovation and AI skills that prepare them for the future of work.
      </p>
    </div>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <button className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-900 hover:bg-gray-100 transition">
            Explore Courses
          </button>

          <button className="rounded-xl border border-white px-8 py-4 font-semibold hover:bg-white hover:text-blue-900 transition">
            Apply Now
          </button>
        </div>

      </section>

      {/* Why We Exist */}
      <section className="mx-auto max-w-6xl">

        <h2 className="mb-6 text-4xl font-bold">
          Why We Exist
        </h2>

        <p className="text-lg leading-9 text-gray-600">
          Technology is transforming every industry. Helen Innovative School
          bridges the gap between traditional education and today's digital
          economy by providing practical, innovation-driven learning that
          prepares learners to succeed in every profession.
        </p>

      </section>

      {/* Vision & Mission */}
      <section className="grid gap-8 lg:grid-cols-2">

        <div className="rounded-3xl border bg-white p-8 shadow-sm">

          <Eye className="mb-4 h-10 w-10 text-blue-700" />

          <h3 className="text-2xl font-bold">
            Our Vision
          </h3>

          <p className="mt-4 leading-7 text-gray-600">
            To become Africa's leading institution for technology-integrated
            professional education and innovation.
          </p>

        </div>

        <div className="rounded-3xl border bg-white p-8 shadow-sm">

          <Rocket className="mb-4 h-10 w-10 text-blue-700" />

          <h3 className="text-2xl font-bold">
            Our Mission
          </h3>

          <p className="mt-4 leading-7 text-gray-600">
            Empowering individuals and organizations with future-ready
            skills, innovative thinking and practical technology knowledge.
          </p>

        </div>

      </section>

      {/* Core Values */}
      <section>

        <h2 className="mb-10 text-center text-4xl font-bold">
          Our Core Values
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div
                key={value.title}
                className="rounded-3xl border bg-white p-8 shadow-sm transition hover:shadow-lg"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-7 w-7 text-blue-700" />
                </div>

                <h3 className="text-xl font-bold">
                  {value.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {value.description}
                </p>

              </div>
            );
          })}

        </div>

      </section>

      {/* Who We Serve */}
      <section>

        <h2 className="mb-10 text-center text-4xl font-bold">
          Who We Serve
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {[
            "Students",
            "Professionals",
            "Entrepreneurs",
            "Organizations",
            "Government Institutions",
            "Career Changers",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-white p-6 text-center shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {item}
              </h3>
            </div>
          ))}

        </div>

      </section>

      {/* Call to Action */}
<section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-20 text-white">

  <div className="mx-auto max-w-5xl px-6 text-center">

    <h2 className="text-4xl font-bold md:text-5xl">
      Ready to Shape the Future?
    </h2>

    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
      Join Helen Innovative School and gain practical, industry-ready skills
      in Artificial Intelligence, digital transformation, innovation and
      emerging technologies. Learn from experienced professionals and prepare
      for the future of work.
    </p>

    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">

      <a
        href="/courses"
        className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-900 transition hover:bg-gray-100"
      >
        Explore Courses
      </a>

      <a
        href="/register"
        className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-900"
      >
        Apply Now
      </a>

    </div>

  </div>

</section>

    </div>
  );
}