'use client'

import Link from 'next/link'
import AuthBrandPanel from '@/components/shared/AuthBrandPanel'
import Logo from '@/components/shared/Logo'

export default function GetStartedPage() {
  return (
    <main className="min-h-screen flex">
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center bg-his-muted px-6 py-12">
        <div className="w-full max-w-5xl">

          <Logo variant="dark" className="lg:hidden mb-8" />

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-his-navy mb-4">
              Join Helen Innovative School
            </h1>

            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Choose how you'd like to get started. Whether you're here to
              learn new skills or teach the next generation of innovators,
              we've got a place for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Student */}

            <div className="bg-white rounded-3xl border border-his-border p-8 shadow-sm hover:shadow-lg transition duration-300">

              <div className="w-16 h-16 rounded-full bg-his-blue/10 flex items-center justify-center text-3xl mb-6">
                🎓
              </div>

              <h2 className="text-2xl font-bold text-his-navy mb-4">
                Student
              </h2>

              <p className="text-slate-600 mb-8">
                Learn practical technology skills from experienced instructors
                and build projects that prepare you for your career.
              </p>

              <ul className="space-y-3 mb-10 text-slate-700">

                <li>✓ Access all available courses</li>

                <li>✓ Complete quizzes and assessments</li>

                <li>✓ Earn certificates</li>

                <li>✓ Join innovation challenges</li>

                <li>✓ Connect with other students</li>

              </ul>

              <Link
                href="/register?role=student"
                className="w-full inline-flex justify-center rounded-xl bg-his-navy py-3 text-white font-semibold hover:bg-his-navy-light transition"
              >
                Continue as Student
              </Link>

            </div>

            {/* Instructor */}

            <div className="bg-white rounded-3xl border border-his-border p-8 shadow-sm hover:shadow-lg transition duration-300">

              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mb-6">
                👨‍🏫
              </div>

              <h2 className="text-2xl font-bold text-his-navy mb-4">
                Instructor
              </h2>

              <p className="text-slate-600 mb-8">
                Share your expertise, create engaging courses, mentor learners,
                and grow your impact through technology education.
              </p>

              <ul className="space-y-3 mb-10 text-slate-700">

                <li>✓ Create and publish courses</li>

                <li>✓ Upload videos and resources</li>

                <li>✓ Manage students</li>

                <li>✓ Monitor learner progress</li>

                <li>✓ Build your teaching profile</li>

              </ul>

              <Link
                href="/register?role=instructor"
                className="w-full inline-flex justify-center rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-700 transition"
              >
                Continue as Instructor
              </Link>

            </div>

          </div>

          <div className="mt-10 text-center">

            <p className="text-slate-500">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-his-blue hover:underline"
              >
                Log in
              </Link>
            </p>

          </div>

        </div>
      </div>
    </main>
  )
}