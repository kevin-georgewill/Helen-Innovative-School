import { Search, ShieldCheck } from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="space-y-20 pb-24">

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 py-24 text-white">

        <div className="mx-auto max-w-5xl px-6 text-center">

          <ShieldCheck className="mx-auto h-16 w-16" />

          <h1 className="mt-6 text-5xl font-bold">
            Verify Certificate
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Verify the authenticity of certificates issued by Helen Innovative
            School using the unique certificate number.
          </p>

        </div>

      </section>

      {/* Verification Form */}
      <section className="mx-auto max-w-3xl px-6">

        <div className="rounded-3xl border bg-white p-10 shadow-sm">

          <h2 className="text-center text-3xl font-bold">
            Certificate Verification
          </h2>

          <p className="mt-4 text-center text-gray-600">
            Enter a certificate number below to verify its authenticity.
          </p>

          <form className="mt-8 flex flex-col gap-4 sm:flex-row">

            <input
              type="text"
              placeholder="Enter Certificate Number"
              className="flex-1 rounded-xl border px-5 py-4 focus:border-blue-600 focus:outline-none"
            />

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-8 py-4 font-semibold text-white transition hover:bg-blue-800"
            >
              <Search size={18} />
              Verify
            </button>

          </form>

        </div>

      </section>

      {/* Information */}
      <section className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-3xl font-bold">
          Why Verify a Certificate?
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
          Certificate verification helps employers, institutions and other
          stakeholders confirm that a certificate was genuinely issued by
          Helen Innovative School and belongs to the rightful recipient.
        </p>

      </section>

    </div>
  );
}