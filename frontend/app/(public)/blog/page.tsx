// Blog index — /blog
// Fetches: GET /api/v1/blog
// Renders article cards with thumbnail, title, category, author, date

import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "How AI is Transforming Healthcare",
    category: "MedTech",
    author: "Helen Innovative School",
    date: "July 20, 2026",
    image: "/images/blog/healthcare-ai.jpg",
  },
  {
    title: "The Future of Financial Technology",
    category: "FinTech",
    author: "Helen Innovative School",
    date: "July 18, 2026",
    image: "/images/blog/fintech.jpg",
  },
  {
    title: "Why Every Professional Needs Digital Skills",
    category: "Innovation",
    author: "Helen Innovative School",
    date: "July 15, 2026",
    image: "/images/blog/digital-skills.jpg",
  },
  {
    title: "Cybersecurity Tips for Beginners",
    category: "CyberTech",
    author: "Helen Innovative School",
    date: "July 12, 2026",
    image: "/images/blog/cybersecurity.jpg",
  },
  {
    title: "Building a Career in Software Development",
    category: "Software",
    author: "Helen Innovative School",
    date: "July 10, 2026",
    image: "/images/blog/software-development.jpg",
  },
  {
    title: "Using AI to Improve Education",
    category: "EdTech",
    author: "Helen Innovative School",
    date: "July 8, 2026",
    image: "/images/blog/ai-education.jpg",
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <h1 className="text-5xl font-bold">
            Helen Insights
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Explore articles on technology, innovation, artificial intelligence,
            digital transformation and the future of professional education.
          </p>

        </div>

      </section>

      {/* Blog Posts */}
      <section className="mx-auto max-w-7xl px-6">

        <h2 className="mb-10 text-center text-4xl font-bold">
          Latest Articles
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {posts.map((post) => (
            <article
              key={post.title}
              className="overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              <Image
                src={post.image}
                alt={post.title}
                width={600}
                height={350}
                className="h-52 w-full object-cover"
              />

              <div className="p-6">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {post.category}
                </span>

                <h3 className="mt-4 text-2xl font-bold leading-snug">
                  {post.title}
                </h3>

                <div className="mt-5 flex items-center justify-between text-sm text-gray-500">

                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>

                </div>

                <button className="mt-6 flex items-center gap-2 font-semibold text-blue-700 transition hover:text-blue-900">
                  Read More
                  <ArrowRight size={18} />
                </button>

              </div>

            </article>
          ))}

        </div>

      </section>

    </div>
  );
}