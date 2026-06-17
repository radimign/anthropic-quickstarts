"use client";

import { useState } from "react";
import {
  Clock,
  Image as ImageIcon,
  Mail,
  Phone,
  Scissors,
  User,
} from "lucide-react";

type ReservationStatus = "new" | "contacted";
type ContactPreference = "osobne" | "telefon";

type Reservation = {
  id: number;
  name: string;
  date: string;
  email: string;
  phone: string;
  hairHistory: string;
  routineTime: string;
  expectations: string;
  contactPreference: ContactPreference;
  status: ReservationStatus;
  hasPhotos: boolean;
};

// Ukázková data (v reálu se načtou z databáze)
const mockReservations: Reservation[] = [
  {
    id: 1,
    name: "Veronika Malá",
    date: "15. 6. 2026",
    email: "veronika.mala@email.cz",
    phone: "+420 777 123 456",
    hairHistory:
      "Vlasy mám hodně zničené po domácím zesvětlování. Rychle plihnou a lámou se.",
    routineTime: "15 minut",
    expectations:
      "Chtěla bych něco přirozeného, co mi dodá objem a nebudu to muset složitě foukat.",
    contactPreference: "osobne",
    status: "new",
    hasPhotos: true,
  },
  {
    id: 2,
    name: "Jana Dvořáková",
    date: "14. 6. 2026",
    email: "jana.dvorakova@email.cz",
    phone: "+420 606 987 654",
    hairHistory:
      "Mám husté, těžké vlasy, které si žijí vlastním životem. Už 5 let nosím stejný střih a cítím, že potřebuji změnu.",
    routineTime: "Do 5 minut",
    expectations: "Chci se jen učesat a jít, aby to vypadalo elegantně.",
    contactPreference: "telefon",
    status: "contacted",
    hasPhotos: false,
  },
];

export default function AdminReservations() {
  const [filter, setFilter] = useState<ReservationStatus>("new");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  const filteredReservations = mockReservations.filter(
    (reservation) => reservation.status === filter,
  );

  const newCount = mockReservations.filter(
    (reservation) => reservation.status === "new",
  ).length;
  const contactedCount = mockReservations.filter(
    (reservation) => reservation.status === "contacted",
  ).length;

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 font-sans text-stone-900 md:flex-row">
      {/* Boční menu (Zjednodušené pro ukázku) */}
      <aside className="flex w-full flex-col gap-6 bg-stone-900 p-6 text-stone-300 md:w-64">
        <h2 className="mb-4 text-xl font-light text-white">
          Radím s vlasy <br />
          <span className="text-sm text-stone-500">Admin prostor</span>
        </h2>
        <nav className="flex flex-col gap-3">
          <a
            href="/admin/reservations"
            className="flex items-center gap-2 rounded-md bg-stone-800 p-2 text-white"
          >
            <Clock size={18} /> Žádosti o konzultaci
          </a>
          <a
            href="/admin/appointments"
            className="flex items-center gap-2 p-2 hover:text-white"
          >
            <User size={18} /> Moji klienti
          </a>
          <a
            href="/admin/gallery"
            className="flex items-center gap-2 p-2 hover:text-white"
          >
            <ImageIcon size={18} /> Správa portfolia
          </a>
        </nav>
      </aside>

      {/* Hlavní obsah */}
      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-1 text-2xl font-medium">
                Žádosti o první konzultaci
              </h1>
              <p className="text-sm text-stone-500">
                Zde vidíš lidi, kteří chtějí začít svou cestu k vlasům, co
                dávají smysl.
              </p>
            </div>
          </div>

          {/* Filtry */}
          <div className="mb-6 flex gap-4 border-b border-stone-200 pb-4">
            <button
              onClick={() => setFilter("new")}
              className={`pb-2 text-sm font-medium transition-colors ${
                filter === "new"
                  ? "border-b-2 border-stone-900 text-stone-900"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Nové žádosti ({newCount})
            </button>
            <button
              onClick={() => setFilter("contacted")}
              className={`pb-2 text-sm font-medium transition-colors ${
                filter === "contacted"
                  ? "border-b-2 border-stone-900 text-stone-900"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Už v řešení ({contactedCount})
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Seznam klientů */}
            <div className="space-y-3 lg:col-span-1">
              {filteredReservations.length === 0 ? (
                <p className="p-4 text-sm italic text-stone-500">
                  Zatím zde nejsou žádné žádosti.
                </p>
              ) : (
                filteredReservations.map((reservation) => (
                  <button
                    type="button"
                    key={reservation.id}
                    onClick={() => setSelectedRes(reservation)}
                    className={`w-full cursor-pointer rounded-lg border p-4 text-left transition-all duration-200 ${
                      selectedRes?.id === reservation.id
                        ? "border-stone-400 bg-white shadow-sm"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-medium text-stone-900">
                        {reservation.name}
                      </h3>
                      <span className="text-xs text-stone-400">
                        {reservation.date}
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-2 text-xs text-stone-500">
                      {reservation.contactPreference === "osobne" ? (
                        <Clock size={12} />
                      ) : (
                        <Phone size={12} />
                      )}
                      <span>
                        {reservation.contactPreference === "osobne"
                          ? "Káva v salonu"
                          : "Telefonát"}
                      </span>
                      {reservation.hasPhotos && (
                        <ImageIcon size={12} className="ml-2 text-stone-400" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Detail klienta */}
            <div className="lg:col-span-2">
              {selectedRes ? (
                <div className="rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
                  <div className="mb-6 flex items-start justify-between border-b border-stone-100 pb-6">
                    <div>
                      <h2 className="mb-2 text-2xl font-light">
                        {selectedRes.name}
                      </h2>
                      <div className="flex flex-col gap-2 text-sm text-stone-600 sm:flex-row sm:gap-4">
                        <span className="flex items-center gap-1">
                          <Mail size={16} /> {selectedRes.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={16} /> {selectedRes.phone}
                        </span>
                      </div>
                    </div>
                    <button className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white transition-colors hover:bg-stone-800">
                      Označit jako vyřešené
                    </button>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-stone-500">
                        <Scissors size={16} /> Historie a trápení
                      </h4>
                      <p className="rounded-md bg-stone-50 p-4 leading-relaxed text-stone-800">
                        „{selectedRes.hairHistory}“
                      </p>
                    </section>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <section>
                        <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
                          Čas na úpravu
                        </h4>
                        <p className="text-stone-800">{selectedRes.routineTime}</p>
                      </section>
                      <section>
                        <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-stone-500">
                          Očekávání
                        </h4>
                        <p className="text-stone-800">
                          {selectedRes.expectations}
                        </p>
                      </section>
                    </div>

                    {selectedRes.hasPhotos && (
                      <section>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-stone-500">
                          <ImageIcon size={16} /> Přiložené fotografie
                        </h4>
                        <div className="flex gap-4">
                          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-stone-200 text-xs text-stone-400">
                            Foto 1
                          </div>
                          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-stone-200 text-xs text-stone-400">
                            Foto 2
                          </div>
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-stone-200 bg-stone-50 text-stone-400">
                  <User size={48} className="mb-4 opacity-50" />
                  <p>Vyber klienta ze seznamu pro zobrazení detailů jeho cesty.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
