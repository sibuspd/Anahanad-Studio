import { ReactNode } from "react";
import {
  Music4,
  GraduationCap,
  Users,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import academyLogo from "@/assets/AS-Logo.png";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-muted/30">
      {/* LEFT PANEL */}

      <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-zinc-100 via-white to-amber-50 px-16">
        <div className="max-w-xl">
          <div className="relative mb-12 flex justify-center">
            {/* Outer ambient glow */}
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="h-[360px] w-[360px] rounded-full bg-amber-200/12 blur-2xl" />
            </div>

            {/* Gold Ring */}
            <div className="relative
    h-[340px]
    w-[340px]
    rounded-full
    bg-gradient-to-br
    from-[#fff6d8]
    via-[#ddb457]
    to-[#8d661a]
    p-[5px]

    shadow-[0_20px_40px_rgba(0,0,0,.18),0_8px_18px_rgba(190,145,35,.22)]

    before:absolute
    before:inset-[3px]
    before:rounded-full
    before:border
    before:border-white/35

    after:absolute
    after:top-5
    after:left-6
    after:h-24
    after:w-20
    after:rounded-full
    after:bg-white/30
    after:blur-xl
    after:content-['']">
              {/* Inner Frame */}
              <div
                className="
        h-full
        w-full
        rounded-full
        overflow-hidden
        bg-black
        ring-2
        ring-white/10
      "
              >
                <img
                  src={academyLogo}
                  alt="Anahanad Music Academy"
                  className="
          h-full
          w-full
          object-cover
          scale-[1.02]
        "
                />
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-zinc-900 leading-tight">
            Music Academy ERP
          </h1>

          <p className="mt-6 text-lg text-zinc-600 leading-8">
            Complete digital management platform for modern music academies.
            Manage students, faculty, courses, batches, attendance and class
            scheduling from one unified dashboard.
          </p>

          <div className="mt-12 space-y-5">
            <Feature
              icon={<Users size={20} />}
              text="Student & Faculty Management"
            />

            <Feature
              icon={<BookOpen size={20} />}
              text="Course & Batch Management"
            />

            <Feature
              icon={<CalendarDays size={20} />}
              text="Attendance & Scheduling"
            />

            <Feature
              icon={<GraduationCap size={20} />}
              text="Role Based ERP Dashboard"
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-amber-600">{icon}</div>

      <span className="text-zinc-700 font-medium">{text}</span>
    </div>
  );
}
