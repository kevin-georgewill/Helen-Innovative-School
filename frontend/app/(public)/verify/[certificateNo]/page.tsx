// Certificate verification page — /verify/[certificateNo]
// Fetches: GET /api/v1/certificates/verify/:certificateNo (public, no auth)
// Shows: student name, course name, issue date, certificate number, valid/invalid status

import { ShieldCheck, Search, BadgeCheck } from "lucide-react";

export default function VerifyCertificatePage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <ShieldCheck className="mx-auto mb-6 h-16 w-16" />

          <h1 className="text-5xl font-bold">
            Verify Certificate
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Confirm the authenticity of certificates issued by Helen
            Innovative School using the certificate number.
          </p>

        </div>

      </section>

      {/* Search */}
      <section className="mx-auto max-w-3xl px-6">

        <div className="rounded-3xl border bg-white p-10 shadow-sm">

          <h2 className="text-3xl font-bold text-center">
            Certificate Verification
          </h2>

          <p className="mt-4 text-center text-gray-600">
            Enter the certificate number below to verify its validity.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">

            <input
              type="text"
              placeholder="Enter Certificate Number"
              className="flex-1 rounded-xl border px-5 py-4 outline-none focus:border-blue-600"
            />

            <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-8 py-4 font-semibold text-white hover:bg-blue-800">

              <Search size={18} />

              Verify

            </button>

          </div>

        </div>

      </section>

    </div>
  );
}