"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
  TrendingUp,
  User,
  Video,
  X,
} from "lucide-react";

const CATEGORIES = [
  "Dámské střihy",
  "Pánské střihy",
  "Dětské střihy",
  "Barvení",
  "Melír & Balayage",
  "Foukaná",
  "Péče",
  "Konzultace",
] as const;

type Category = (typeof CATEGORIES)[number];

type Service = {
  id: number;
  category: Category | "Konzultace";
  title: string;
  duration: string;
  price: string;
  desc: string;
  image: string;
  type?: "online";
};

type Slot = {
  id: number;
  day: string;
  date: string;
  time: string;
  score: number;
  reason: string;
};

const SERVICES_DATA: Service[] = [
  // Dámské střihy
  {
    id: 101,
    category: "Dámské střihy",
    title: "Střih - Krátké vlasy",
    duration: "45 min",
    price: "450 Kč",
    desc: "Mytí, masáž hlavy, foukaná",
    image:
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 102,
    category: "Dámské střihy",
    title: "Střih - Polodlouhé vlasy",
    duration: "60 min",
    price: "600 Kč",
    desc: "Mytí, masáž hlavy, foukaná",
    image:
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 103,
    category: "Dámské střihy",
    title: "Střih - Dlouhé vlasy",
    duration: "75 min",
    price: "750 Kč",
    desc: "Mytí, masáž hlavy, foukaná",
    image:
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 104,
    category: "Dámské střihy",
    title: "Střih - Extra dlouhé",
    duration: "90 min",
    price: "1 000 Kč",
    desc: "Mytí, masáž hlavy, foukaná",
    image:
      "https://images.unsplash.com/photo-1605497788044-5d32c7378424?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Pánské střihy
  {
    id: 201,
    category: "Pánské střihy",
    title: "Klasický pánský střih",
    duration: "50 min",
    price: "350 Kč",
    desc: "Mytí, foukaná, styling, vousy dle přání",
    image:
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 202,
    category: "Pánské střihy",
    title: "Střih + Úprava vousů",
    duration: "75 min",
    price: "500 Kč",
    desc: "Kompletní péče včetně vousů",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b7f304?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Dětské střihy
  {
    id: 301,
    category: "Dětské střihy",
    title: "Dětský střih (do 6 let)",
    duration: "45 min",
    price: "200 Kč",
    desc: "Jemné mytí, střih, styling",
    image:
      "https://images.unsplash.com/photo-1596464716127-f9a865e0cb31?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 302,
    category: "Dětské střihy",
    title: "Dětský střih (6-15 let)",
    duration: "50 min",
    price: "250 Kč",
    desc: "Klasický střih",
    image:
      "https://images.unsplash.com/photo-1619864223681-37d45543c3a9?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 303,
    category: "Dětské střihy",
    title: "Dívčí střih (do 13 let)",
    duration: "60 min",
    price: "450 Kč",
    desc: "Střih pro slečny",
    image:
      "https://images.unsplash.com/photo-1520697951239-653457c15442?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Barvení
  {
    id: 401,
    category: "Barvení",
    title: "Barva - Krátké vlasy",
    duration: "120 min",
    price: "650 Kč",
    desc: "Včetně konzultace, Fibreplex (poměr 1:1, 40g)",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 402,
    category: "Barvení",
    title: "Barva - Polodlouhé",
    duration: "120 min",
    price: "1 050 Kč",
    desc: "Včetně konzultace, Fibreplex (poměr 1:1, 60g)",
    image:
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 403,
    category: "Barvení",
    title: "Barva - Dlouhé",
    duration: "120 min",
    price: "1 450 Kč",
    desc: "Včetně konzultace, Fibreplex (poměr 1:1, 80g)",
    image:
      "https://images.unsplash.com/photo-1519699047748-40ba5267930b?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 404,
    category: "Barvení",
    title: "Tónování",
    duration: "30 min",
    price: "600 Kč",
    desc: "Oživení barvy (poměr 1:2, 40g)",
    image:
      "https://images.unsplash.com/photo-1492106087820-71f171d7d324?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Melír & Balayage
  {
    id: 501,
    category: "Melír & Balayage",
    title: "Melír - Krátké vlasy",
    duration: "210 min",
    price: "900 Kč",
    desc: "Včetně péče a stylingu",
    image:
      "https://images.unsplash.com/photo-1632345031635-7b80005a6945?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 502,
    category: "Melír & Balayage",
    title: "Melír - Dlouhé vlasy",
    duration: "210 min",
    price: "1 500 Kč",
    desc: "Včetně péče a stylingu",
    image:
      "https://images.unsplash.com/photo-1523264629844-40d9cb52543a?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 503,
    category: "Melír & Balayage",
    title: "Balayage / Ombré",
    duration: "240 min",
    price: "od 1 300 Kč",
    desc: "Komplexní technika barvení",
    image:
      "https://images.unsplash.com/photo-1595867865417-bb8940aff7db?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Foukaná
  {
    id: 601,
    category: "Foukaná",
    title: "Foukaná do vln - Krátké",
    duration: "40 min",
    price: "450 Kč",
    desc: "Mytí, masáž hlavy, styling",
    image:
      "https://images.unsplash.com/photo-1582095133179-bfd08d34aa9e?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 602,
    category: "Foukaná",
    title: "Foukaná do vln - Dlouhé",
    duration: "60 min",
    price: "650 Kč",
    desc: "Mytí, masáž hlavy, styling",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Péče
  {
    id: 701,
    category: "Péče",
    title: "Vlasová maska",
    duration: "20 min",
    price: "300 Kč",
    desc: "Výživa a regenerace",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 702,
    category: "Péče",
    title: "Fibreplex Ošetření",
    duration: "60 min",
    price: "od 800 Kč",
    desc: "Profesionální ochrana vlasu",
    image:
      "https://images.unsplash.com/photo-1576426863848-c21858adc850?auto=format&fit=crop&q=80&w=300&h=200",
  },
  {
    id: 703,
    category: "Péče",
    title: "Detoxikační kúra",
    duration: "45 min",
    price: "500 Kč",
    desc: "Hloubkové čištění pokožky",
    image:
      "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?auto=format&fit=crop&q=80&w=300&h=200",
  },

  // Extra (AURA special)
  {
    id: 901,
    category: "Konzultace",
    title: "AI Vlasová Konzultace",
    duration: "30 min",
    price: "800 Kč",
    type: "online",
    desc: "Online analýza a návrh stylu",
    image:
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=300&h=200",
  },
];

const AI_SLOTS: Slot[] = [
  { id: 101, day: "Zítra", date: "7. Pro", time: "14:00", score: 98, reason: "Odpovídá vaší historii" },
  { id: 102, day: "Úterý", date: "9. Pro", time: "09:00", score: 95, reason: "Klidnější čas v salonu" },
  { id: 103, day: "Čtvrtek", date: "11. Pro", time: "16:30", score: 89, reason: "Navazuje na váš styl" },
];

type Tab = "home" | "booking" | "consult" | "profile";

function AuraPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showBooking, setShowBooking] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Dámské střihy");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [notification, setNotification] = useState<{
    title: string;
    msg: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({
        title: "Aura Intelligence",
        msg: "Je čas na oživení barvy. Našli jsme pro vás ideální slot na příští týden.",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredServices = useMemo(
    () =>
      SERVICES_DATA.filter((service) =>
        selectedCategory === "Konzultace"
          ? service.type === "online"
          : service.category === selectedCategory,
      ),
    [selectedCategory],
  );

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setBookingStep(1);
  };

  const confirmBooking = () => {
    setBookingStep(2);
    setTimeout(() => {
      setShowBooking(false);
      setBookingStep(0);
      setSelectedService(null);
      setNotification({
        title: "Potvrzeno",
        msg: "Termín byl úspěšně rezervován a přidán do kalendáře.",
      });
    }, 3000);
  };

  const Navigation = () => (
    <div className="safe-area-pb fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-zinc-800 bg-zinc-900/90 px-6 py-4 backdrop-blur-xl">
      <button
        onClick={() => setActiveTab("home")}
        className={`flex flex-col items-center space-y-1 ${activeTab === "home" ? "text-amber-200" : "text-zinc-500"}`}
      >
        <Sparkles size={20} />
        <span className="text-[10px] uppercase tracking-widest">Aura</span>
      </button>
      <button
        onClick={() => {
          setActiveTab("booking");
          setShowBooking(true);
        }}
        className={`flex flex-col items-center space-y-1 ${activeTab === "booking" ? "text-amber-200" : "text-zinc-500"}`}
      >
        <Calendar size={20} />
        <span className="text-[10px] uppercase tracking-widest">Rezervace</span>
      </button>
      <button
        onClick={() => setActiveTab("consult")}
        className={`flex flex-col items-center space-y-1 ${activeTab === "consult" ? "text-amber-200" : "text-zinc-500"}`}
      >
        <Video size={20} />
        <span className="text-[10px] uppercase tracking-widest">Konzultace</span>
      </button>
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex flex-col items-center space-y-1 ${activeTab === "profile" ? "text-amber-200" : "text-zinc-500"}`}
      >
        <User size={20} />
        <span className="text-[10px] uppercase tracking-widest">Profil</span>
      </button>
    </div>
  );

  const Header = () => (
    <div className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-2xl font-light tracking-tight text-white">
          AURA <span className="bg-gradient-to-r from-amber-200 to-yellow-600 bg-clip-text font-bold text-transparent">ELITE</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-zinc-400">System</p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 bg-gradient-to-br from-zinc-700 to-zinc-800">
        <span className="text-sm font-medium text-white">RI</span>
      </div>
    </div>
  );

  const SmartCard = () => (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-800/50 p-6">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/20 blur-3xl" />

      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-200">Nadcházející Termín</p>
          <h3 className="text-xl font-light text-white">Konzultace & Střih</h3>
        </div>
        <div className="min-w-[60px] rounded-xl border border-zinc-700 bg-zinc-900/80 p-2 text-center">
          <span className="block text-xs uppercase text-zinc-400">Zítra</span>
          <span className="block text-lg font-bold text-white">14:00</span>
        </div>
      </div>

      <div className="mb-4 flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-zinc-700">
          <Image
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100"
            alt="Radim Ignácek"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm text-white">Radim Ignácek</p>
          <p className="text-xs text-zinc-500">Master Stylist</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-zinc-200">
          Spravovat
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 py-3 text-sm font-medium text-white">
          <MapPin size={14} /> Navigovat
        </button>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="mb-8 grid grid-cols-2 gap-4">
      <button
        onClick={() => {
          setActiveTab("booking");
          setShowBooking(true);
        }}
        className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-amber-500/50"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/0 to-zinc-800/50 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-amber-200 transition-transform group-hover:scale-110">
          <Sparkles size={20} />
        </div>
        <div className="relative z-10">
          <span className="mb-1 block text-2xl font-light text-white">Nová</span>
          <span className="block text-sm text-zinc-400">Rezervace</span>
        </div>
      </button>

      <button className="group relative flex h-40 flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-blue-500/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-blue-200">
          <Video size={20} />
        </div>
        <div className="relative z-10">
          <span className="mb-1 block text-2xl font-light text-white">Online</span>
          <span className="block text-sm text-zinc-400">Konzultace</span>
        </div>
      </button>
    </div>
  );

  const Notification = () => {
    if (!notification) return null;
    return (
      <div className="fixed left-4 right-4 top-4 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-start gap-3 rounded-2xl border border-zinc-700 bg-zinc-800/90 p-4 text-white shadow-2xl backdrop-blur-md">
          <div className="shrink-0 rounded-full bg-amber-500/20 p-2 text-amber-400">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-amber-100">{notification.title}</h4>
            <p className="mt-1 text-xs text-zinc-300">{notification.msg}</p>
          </div>
          <button onClick={() => setNotification(null)} className="text-zinc-500 transition hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    );
  };

  const BookingModal = () => (
    <div
      className={`fixed inset-0 z-40 min-h-screen overflow-y-auto bg-zinc-950 transition-transform duration-500 ${
        showBooking ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setShowBooking(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-white"
          >
            <X size={20} />
          </button>
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
            {bookingStep === 0 ? "Nabídka Služeb" : bookingStep === 1 ? "Smart Termíny" : "Potvrzení"}
          </h2>
          <div className="w-10" />
        </div>

        {bookingStep === 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <p className="mb-6 text-xl font-light text-white">Vyberte si kategorii</p>

            <div className="-mx-2 mb-4 flex gap-2 overflow-x-auto px-2 pb-4 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                      : "border border-zinc-800 bg-zinc-900 text-zinc-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleBookService(service)}
                  className="group relative flex h-28 cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all hover:border-amber-500/50"
                >
                  <div className="relative h-full w-28">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                    {service.type === "online" && (
                      <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                        Online
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="font-medium text-white">{service.title}</h3>
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{service.desc}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="block font-medium text-amber-200">{service.price}</span>
                        <span className="block text-xs text-zinc-600">{service.duration}</span>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 transition-colors group-hover:bg-amber-500 group-hover:text-black">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookingStep === 1 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 animate-pulse">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Analyzuji váš rozvrh...</p>
                <p className="text-xs text-zinc-500">
                  Našli jsme 3 perfektní termíny pro <span className="text-amber-200">{selectedService?.title}</span>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {AI_SLOTS.map((slot) => (
                <div
                  key={slot.id}
                  onClick={confirmBooking}
                  className="relative cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-amber-500"
                >
                  {slot.score > 90 && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-amber-500 px-3 py-1 text-[10px] font-bold text-black">
                      {slot.score}% SHODA
                    </div>
                  )}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-2xl font-light text-white">{slot.time}</span>
                    <span className="text-sm uppercase tracking-wider text-zinc-400">{slot.day}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">{slot.date}</span>
                    <span className="text-xs italic text-amber-500/80">{slot.reason}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setBookingStep(0)} className="mt-8 w-full py-4 text-sm text-zinc-500 transition hover:text-white">
              Změnit službu
            </button>
          </div>
        )}

        {bookingStep === 2 && (
          <div className="flex h-[60vh] flex-col items-center justify-center animate-in zoom-in duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="mb-2 text-2xl font-light text-white">Rezervováno</h3>
            <p className="mb-8 max-w-xs text-center text-zinc-400">
              Zablokovali jsme částku na vaší kartě. Potvrzení vám přijde do aplikace.
            </p>
            <div className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-500">Služba</span>
                <span className="text-white">{selectedService?.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Cena</span>
                <span className="text-amber-200">{selectedService?.price}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-zinc-500">Délka</span>
                <span className="text-white">{selectedService?.duration}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 pb-20 font-sans text-zinc-200 selection:bg-amber-500/30">
      <Notification />
      <BookingModal />

      <div className="px-6">
        <Header />

        <div className="mb-6">
          <p className="text-3xl font-light leading-tight text-white">
            Dobré odpoledne,
            <br />
            <span className="text-zinc-500">připravena zazářit?</span>
          </p>
        </div>

        <SmartCard />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Rychlé Akce</h2>
        </div>

        <QuickActions />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Trendy pro vás</h2>
          <span className="flex items-center gap-1 text-xs text-amber-500">
            <TrendingUp size={12} /> AI Výběr
          </span>
        </div>

        <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-6 scrollbar-hide">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group relative h-[220px] min-w-[160px] overflow-hidden rounded-2xl bg-zinc-900">
              <Image
                src={`https://images.unsplash.com/photo-${
                  i === 1 ? "1595476108010-b4d1f102b1b1" : i === 2 ? "1562322140-8baeececf3df" : "1605497788044-5d32c7378424"
                }?auto=format&fit=crop&q=80&w=300&h=400`}
                alt="Trend"
                fill
                sizes="160px"
                className="object-cover opacity-60 transition-opacity group-hover:opacity-40"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
                <p className="text-sm font-medium text-white">Platinum Blonde</p>
                <p className="mt-1 text-xs text-zinc-400">Doporučeno pro váš typ pleti</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Navigation />
    </div>
  );
}

export default AuraPage;
