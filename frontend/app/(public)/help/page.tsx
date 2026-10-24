import {
  HelpCircle,
  BookOpen,
  Clock,
  Award,
  Globe,
  MessageCircle,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'

const faqs = [
  {
    icon: BookOpen,
    question: 'How do I enroll?',
    answer:
      'Browse our courses, choose a program and complete the online application process.',
  },
  {
    icon: Globe,
    question: 'Can I study online?',
    answer:
      'Yes. Helen Innovative School offers physical, virtual and hybrid learning options.',
  },
  {
    icon: Clock,
    question: 'How long are the programs?',
    answer:
      'Programs range from 2-week express courses to 12-month diploma programs.',
  },
  {
    icon: Award,
    question: 'Will I receive a certificate?',
    answer:
      'Yes. Learners receive certificates or diplomas upon successful completion.',
  },
]

const locations = [
  'Lagos, Nigeria',
  'Nairobi, Kenya',
  'Accra, Ghana',
  'Johannesburg, South Africa',
]

const whatsappLink = 'https://wa.me/2347033977294'

export default function HelpPage() {
  return (
    <div className="space-y-20 pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-24 text-center text-white">
        <HelpCircle className="mx-auto h-16 w-16" />

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
          Help Centre
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
          Find answers to common questions about admissions, learning,
          certificates and student support.
        </p>
      </section>

      {/* FAQs */}
      <section className="mx-auto max-w-6xl px-6">
        <h2 className="mb-10 text-center text-3xl font-bold sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => {
            const Icon = faq.icon

            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md"
              >
                <Icon className="mb-4 h-10 w-10 text-blue-700" />

                <h3 className="text-xl font-bold">{faq.question}</h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {faq.answer}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <MessageCircle className="mx-auto h-12 w-12" />

          <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
            Still Need Help?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Have a question about our programs or admissions? Contact our
            team on WhatsApp and we’ll be happy to assist you.
          </p>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-blue-900 transition hover:bg-blue-50"
          >
            <MessageCircle className="h-5 w-5" />
            Chat with Us on WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Locations */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <MapPin className="mx-auto h-10 w-10 text-blue-700" />

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            Our Locations
          </h2>

          <p className="mt-3 text-gray-600">
            Connecting learners across key cities in Africa.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((location) => (
            <div
              key={location}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5"
            >
              <MapPin className="h-5 w-5 shrink-0 text-blue-700" />
              <span className="font-medium text-gray-800">{location}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}