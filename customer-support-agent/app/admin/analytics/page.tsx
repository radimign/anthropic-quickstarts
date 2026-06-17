"use client";

import { useState } from "react";
import {
  BarChart3,
  CalendarCheck,
  Clock,
  Image as ImageIcon,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";

const funnelData = [
  {
    keyword: "START",
    intent: "Přímá rezervace",
    messages: 45,
    bookings: 15,
    color: "bg-stone-900",
  },
  {
    keyword: "RODINA",
    intent: "Hledání správné cesty a klidu",
    messages: 62,
    bookings: 12,
    color: "bg-stone-600",
  },
  {
    keyword: "CESTA",
    intent: "Vlasy jako kronika života",
    messages: 28,
    bookings: 8,
    color: "bg-stone-400",
  },
];

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState("month");

  const totalMessages = funnelData.reduce(
    (accumulator, current) => accumulator + current.messages,
    0,
  );
  const totalBookings = funnelData.reduce(
    (accumulator, current) => accumulator + current.bookings,
    0,
  );
  const conversionRate = Math.round((totalBookings / totalMessages) * 100);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 md:flex-row">
      <aside className="flex w-full flex-col gap-6 bg-stone-900 p-6 text-stone-300 md:w-64">
        <h2 className="mb-4 text-xl font-light text-white">
          Radím s vlasy <br />
          <span className="text-sm text-stone-500">Admin prostor</span>
        </h2>
        <nav className="flex flex-col gap-3">
          <a
            href="/admin/reservations"
            className="flex items-center gap-2 rounded-md p-2 transition-colors hover:text-white"
          >
            <Clock size={18} /> Žádosti o konzultaci
          </a>
          <a
            href="/admin/appointments"
            className="flex items-center gap-2 p-2 transition-colors hover:text-white"
          >
            <Users size={18} /> Moji klienti
          </a>
          <a
            href="/admin/gallery"
            className="flex items-center gap-2 p-2 transition-colors hover:text-white"
          >
            <ImageIcon size={18} /> Správa portfolia
          </a>
          <a
            href="/admin/analytics"
            className="flex items-center gap-2 rounded-md bg-stone-800 p-2 text-white transition-colors"
          >
            <BarChart3 size={18} /> Analytika funnelů
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-center">
            <div>
              <h1 className="mb-1 text-2xl font-medium">
                Úspěšnost obsahu a komunikace
              </h1>
              <p className="text-sm text-stone-500">
                Sleduj, která klíčová slova reálně přivádějí klienty do tvého
                křesla.
              </p>
            </div>
            <select
              value={timeframe}
              onChange={(event) => setTimeframe(event.target.value)}
              className="cursor-pointer rounded-md border border-stone-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
            >
              <option value="week">Posledních 7 dní</option>
              <option value="month">Tento měsíc</option>
              <option value="year">Tento rok</option>
            </select>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="rounded-full bg-stone-100 p-3 text-stone-700">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Zahájené konverzace (DM)
                </p>
                <h3 className="mt-1 text-3xl font-light">{totalMessages}</h3>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="rounded-full bg-stone-100 p-3 text-stone-700">
                <CalendarCheck size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Sjednané konzultace
                </p>
                <h3 className="mt-1 text-3xl font-light">{totalBookings}</h3>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="rounded-full bg-stone-100 p-3 text-stone-700">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Konverzní poměr
                </p>
                <h3 className="mt-1 text-3xl font-light">{conversionRate}%</h3>
                <p className="mt-1 text-xs text-green-600">Slušný výsledek! 🤍</p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-medium">
              <BarChart3 size={20} className="text-stone-500" /> Analýza
              klíčových slov
            </h2>

            <div className="space-y-8">
              {funnelData.map((item) => {
                const conversion = Math.round(
                  (item.bookings / item.messages) * 100,
                );

                return (
                  <div key={item.keyword}>
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <span className="text-sm font-bold tracking-wider text-stone-900">
                          {item.keyword}
                        </span>
                        <span className="ml-2 hidden text-xs text-stone-400 sm:inline-block">
                          ({item.intent})
                        </span>
                      </div>
                      <div className="text-sm font-medium text-stone-600">
                        {item.bookings} z {item.messages} konverzací{" "}
                        <span className="font-normal text-stone-400">
                          ({conversion} %)
                        </span>
                      </div>
                    </div>
                    <div className="flex h-3 w-full overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${conversion}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-stone-900 p-8 text-stone-50 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-white">
              Radimovo zhodnocení měsíce
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-stone-400">
              Zde je prostor pro tvé měsíční &quot;Stop / Start / Continue&quot;
              zamyšlení, jak máš uvedeno v manuálu. Neřešíme ego, řešíme
              pocity klientů a kvalitu naší práce.
            </p>
            <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3">
              <div className="rounded-md bg-stone-800 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-red-400">
                  Stop
                </span>
                <p className="text-stone-300">
                  Videa bez jasného hooku na začátku. Pokud není první sekunda
                  jasná, klienti nepíšou slovo RODINA.
                </p>
              </div>
              <div className="rounded-md bg-stone-800 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-green-400">
                  Start
                </span>
                <p className="text-stone-300">
                  Více opakovat sérii &quot;Proč jsem kadeřník&quot; s výzvou
                  CESTA. Evidentně to buduje velkou důvěru.
                </p>
              </div>
              <div className="rounded-md bg-stone-800 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-blue-400">
                  Continue
                </span>
                <p className="text-stone-300">
                  Udržet klidný tón a minimalismus. Kvalitní proměny s edukací
                  bez zbytečné omáčky.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
