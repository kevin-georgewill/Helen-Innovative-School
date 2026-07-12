interface WelcomeBannerProps {
  name: string;
  department: string;
  date: string;
}

export default function WelcomeBanner({
  name,
  department,
  date,
}: WelcomeBannerProps) {
  return (
    <section className="overflow-hidden rounded-3xl bg-[#0F2E73] px-8 py-8 text-white shadow-sm">

      <div className="space-y-2">

        <h1 className="text-4xl font-bold">
          Welcome back, {name}
        </h1>

        <p className="text-xl text-blue-100">
          {department}
        </p>

        <p className="text-sm text-blue-200">
          Today's overview. {date}
        </p>

      </div>

    </section>
  );
}