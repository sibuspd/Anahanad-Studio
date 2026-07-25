import { ReactNode } from "react";
import {
  Music2,
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

      <div
    className="
    absolute
    inset-0
    bg-[radial-gradient(circle_at_35%_25%,rgba(255,245,210,.7),transparent_45%)]
    pointer-events-none
"/>

      <div
        className="relative
    overflow-hidden
    hidden
    lg:flex
    flex-col
    justify-center
    bg-gradient-to-br
    from-stone-100
via-[#fffdf7]
to-[#f8ecd0]
    px-16"
      >
        {/* Decorative Elements */}
        <Music4
          className="
absolute
    left-6
    top-24
    h-44
    w-44
    text-[#8B6823]
opacity-55
drop-shadow-[0_0_6px_rgba(220,180,80,.25)]
    -rotate-6
    pointer-events-none
"
        />

        <Music2
          className="
        absolute
    right-36
    top-28
    h-8
    w-8
    text-amber-300/60
    rotate-12
    "
        />

        <Music2
          className="
        absolute
    right-20
    top-44
    h-7
    w-7
    text-[#d7ae56]
opacity-90
drop-shadow-[0_0_6px_rgba(220,180,80,.25)]
    rotate-12
    "
        />

        <svg
          className="
    absolute
    right-0
    top-0
    h-full
    w-[520px]
    opacity-70
    pointer-events-none
  "
          viewBox="0 0 520 600"
        >
          ...
        </svg>

        <svg
          className="
    absolute
    bottom-0
    left-[30%]
    w-[85%]
    h-[220px]
    pointer-events-none
    opacity-95
  "
          viewBox="0 0 1200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="waveGold" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F8E7B0" stopOpacity="0" />
              <stop offset="30%" stopColor="#D9B35C" />
              <stop offset="70%" stopColor="#C89B3C" />
              <stop offset="100%" stopColor="#8B6823" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 180
       C180 120 320 220 500 170
       C700 110 900 240 1200 160"
            stroke="url(#waveGold)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M0 195
       C170 140 340 240 520 185
       C720 130 920 250 1200 180"
            stroke="url(#waveGold)"
            strokeWidth="2.5"
            opacity=".65"
            strokeLinecap="round"
          />

          <path
            d="M0 210
       C200 165 360 250 560 205
       C760 160 960 260 1200 205"
            stroke="url(#waveGold)"
            strokeWidth="2"
            opacity=".4"
            strokeLinecap="round"
          />
        </svg>

        <div className="max-w-xl mx-auto">
          <div className="relative mb-12 flex justify-center">
            {/* Outer ambient glow */}
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="h-[360px] w-[360px] rounded-full bg-amber-200/12 blur-2xl" />
            </div>

            {/* Outer Halo */}
            <div
              className="
        absolute
        inset-0
        flex
        items-center
        justify-center
        pointer-events-none
    "
            >
              <div
                className="
            h-[360px]
            w-[360px]
            rounded-full
            bg-amber-300/12
            blur-[45px]
        "
              />
            </div>

            {/* Gold Ring */}
            <div
              className="relative
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
    after:content-['']"
            >
              {/* Inner Frame */}
              <div
                className="
        h-full
        w-full
        rounded-full
        overflow-hidden
        bg-gradient-to-br
        from-zinc-900
        via-black
        to-zinc-950
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

          {/* Floating Ribbon */}
          <svg
            className="
    absolute
    left-[67%]
    top-[320px]
    w-[520px]
    h-[290px]
    overflow-visible
    pointer-events-none
    opacity-95
  "
            viewBox="0 0 520 220"
            fill="none"
          >
            <defs>
              <linearGradient id="ribbonGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FFF6D6" stopOpacity=".95" />
                <stop offset="0%" stopColor="#FFF6D8" />
                <stop offset="25%" stopColor="#E9C26A" />
                <stop offset="55%" stopColor="#D2A145" />
                <stop offset="82%" stopColor="#A6781C" />
                <stop offset="100%" stopColor="#8A641A" stopOpacity="0" />
                <stop offset="70%" stopColor="#C3922F" stopOpacity=".45" />
                <stop offset="100%" stopColor="#8A641A" stopOpacity="0" />
              </linearGradient>

              <filter id="softGlow">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            {/* Upper Ribbon */}
            <path
              d="
      M0 30
      C70 15 130 35 190 55
      C280 85 360 95 520 70
    "
              stroke="url(#ribbonGold)"
              strokeWidth="6.5"
              strokeLinecap="round"
            />

            {/* Middle Ribbon */}
            <path
              d="
      M0 55
      C90 40 160 70 230 90
      C330 120 410 125 520 105
    "
              stroke="url(#ribbonGold)"
              strokeWidth="3.8"
              opacity=".65"
              strokeLinecap="round"
            />

            {/* Thin Highlight */}
            <path
              d="
      M0 18
      C80 8 150 18 230 40
      C330 65 420 70 520 58
    "
              stroke="#FFF4D5"
              strokeOpacity=".45"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>

          <h1 className="text-5xl font-bold text-zinc-900 leading-tight text-center">
            Music Academy ERP
          </h1>

          <p className="mt-6 text-lg text-zinc-600 leading-8 text-left max-w-lg mx-auto">
            Complete digital management platform for modern music academies.
            Manage students, faculty, courses, batches, attendance and class
            scheduling from one unified dashboard.
          </p>

          <div className="mt-12 space-y-5 max-w-md mx-auto">
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

        <div
    className="
    absolute
    inset-0
    bg-gradient-to-b
    from-transparent
    via-transparent
    to-amber-100/40
    pointer-events-none
"/>
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
