"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Pencil,
} from "lucide-react";

interface ProfileCardProps {
  name: string;
  department: string;
  qualification: string;
  email: string;
  phone: string;
  country: string;
  workDays: string;
  image?: string;
}

export default function ProfileCard({
  name,
  department,
  qualification,
  email,
  phone,
  country,
  workDays,
  image = "/profile.png",
}: ProfileCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          {/* Profile Image */}
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-blue-100">

            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />

          </div>

          {/* Profile Details */}
          <div>

            <h2 className="text-3xl font-bold text-gray-900">
              {name}
            </h2>

            <div className="mt-3 flex flex-wrap gap-3">

              <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                {department}
              </span>

              <span className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
                {qualification}
              </span>

            </div>

            <div className="mt-6 grid gap-4 text-sm text-gray-600 md:grid-cols-2">

              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <span>{email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                <span>{phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-blue-600" />
                <span>{country}</span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={18} className="text-blue-600" />
                <span>{workDays}</span>
              </div>

            </div>

          </div>

        </div>

        {/* Edit Button */}
        <div className="self-start lg:self-center">

          <button className="flex items-center gap-2 rounded-xl bg-blue-900 px-6 py-3 text-white transition hover:bg-blue-800">

            <Pencil size={18} />

            <span className="font-medium">
              Edit Profile
            </span>

          </button>

        </div>

      </div>

    </div>
  );
}