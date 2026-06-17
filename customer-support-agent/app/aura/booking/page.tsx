"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { CheckCircle, Clock, Coffee, Scissors } from "lucide-react";

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  hairHistory: string;
  routineTime: string;
  expectations: string;
  contactPreference: "osobne" | "telefon";
  gdprConsent: boolean;
};

export default function Booking() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    hairHistory: "",
    routineTime: "10",
    expectations: "",
    contactPreference: "osobne",
    gdprConsent: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Zde by v reálu proběhlo odeslání dat na server/email.
    console.info("Odeslána data z formuláře:", formData);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 p-6 font-sans">
        <div className="max-w-md rounded-lg border border-stone-200 bg-white p-10 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-6 h-16 w-16 text-stone-800" />
          <h2 className="mb-4 text-2xl font-light text-stone-900">Děkuju za důvěru. 🤍</h2>
          <p className="mb-6 leading-relaxed text-stone-600">
            Tvé odpovědi jsem v pořádku přijal. Brzy se ti ozvu, abychom domluvili přesný termín naší konzultace.
          </p>
          <button
            onClick={() => {
              window.location.href = "/aura";
            }}
            className="text-stone-500 underline underline-offset-4 transition-colors hover:text-stone-900"
          >
            Vrátit se na hlavní stránku
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-6 py-20 font-sans text-stone-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center md:text-left">
          <h1 className="mb-4 text-3xl font-light md:text-4xl">První krok k vlasům, které dávají smysl.</h1>
          <p className="text-lg leading-relaxed text-stone-600">
            Vyplň prosím v klidu tento krátký dotazník. Pomůže mi to pochopit, čím si tvé vlasy prošly a jaký styl ti usnadní každodenní život. Úvodní konzultace je zcela nezávazná.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 rounded-lg border border-stone-200 bg-white p-8 shadow-sm md:p-12">
          <section>
            <h2 className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-4 text-xl font-medium">
              <span className="rounded-full bg-stone-100 p-2">
                <Coffee size={20} className="text-stone-700" />
              </span>
              O tobě
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm text-stone-500">Jméno a příjmení</span>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm text-stone-500">Telefon (pro rychlou domluvu)</span>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm text-stone-500">E-mail</span>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400" />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-6 flex items-center gap-3 border-b border-stone-100 pb-4 text-xl font-medium">
              <span className="rounded-full bg-stone-100 p-2">
                <Scissors size={20} className="text-stone-700" />
              </span>
              Tvé vlasy a očekávání
            </h2>
            <div className="space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm text-stone-500">Co tě na vlasech aktuálně nejvíc trápí?</span>
                <textarea required name="hairHistory" value={formData.hairHistory} onChange={handleChange} rows={3} placeholder="Např. špatně se upravují, rychle plihnou, zničené konečky..." className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400" />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm text-stone-500">
                  <Clock size={16} /> Kolik času chceš ráno úpravě vlasů reálně věnovat?
                </span>
                <select name="routineTime" value={formData.routineTime} onChange={handleChange} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400">
                  <option value="5">Chci se jen učesat a jít (do 5 minut)</option>
                  <option value="15">Základní rychlá foukaná (10-15 minut)</option>
                  <option value="30">Ráda si vlasy upravuji detailně (více než 20 minut)</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-stone-500">Jak si představuješ ideální výsledek?</span>
                <textarea name="expectations" value={formData.expectations} onChange={handleChange} rows={2} className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-stone-400" />
              </label>
            </div>
          </section>

          <section>
            <h2 className="mb-6 border-b border-stone-100 pb-4 text-xl font-medium">Dokončení</h2>
            <div className="space-y-6">
              <fieldset>
                <legend className="mb-3 block text-sm text-stone-500">Jak by ti vyhovovalo provést první konzultaci?</legend>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="contactPreference" value="osobne" checked={formData.contactPreference === "osobne"} onChange={handleChange} className="accent-stone-800" />
                    <span>Osobně u kávy v salonu (Znojmo)</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="radio" name="contactPreference" value="telefon" checked={formData.contactPreference === "telefon"} onChange={handleChange} className="accent-stone-800" />
                    <span>Rychlý telefonát / Videohovor</span>
                  </label>
                </div>
              </fieldset>

              <label className="flex items-start gap-3 pt-4">
                <input required type="checkbox" name="gdprConsent" checked={formData.gdprConsent} onChange={handleChange} className="mt-1 cursor-pointer accent-stone-800" />
                <span className="text-sm leading-relaxed text-stone-500">
                  Souhlasím se zpracováním osobních údajů pro účely domluvení termínu a následné kadeřnické péče. Vím, že kadeřnictví není továrna a s mými daty bude Radim nakládat s maximálním respektem a podle <a href="#" className="underline">zásad GDPR</a>.
                </span>
              </label>
            </div>
          </section>

          <button type="submit" className="w-full rounded-md bg-stone-900 py-4 font-medium text-stone-50 transition-colors duration-300 hover:bg-stone-800">
            Odeslat a domluvit konzultaci
          </button>
        </form>
      </div>
    </div>
  );
}
