"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import {
  BarChart3,
  CheckSquare,
  Clock,
  Edit3,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';

type GalleryItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'published' | 'draft';
  imageUrl: string;
};

type ChecklistState = {
  lighting: boolean;
  education: boolean;
  minimalism: boolean;
  clientConsent: boolean;
};

const placeholderImage =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%23e7e5e4"/><path d="M120 330c52-80 96-80 148 0" fill="none" stroke="%2378716c" stroke-width="12" stroke-linecap="round"/><circle cx="200" cy="175" r="58" fill="%23a8a29e"/><text x="200" y="430" text-anchor="middle" font-family="Arial" font-size="22" fill="%2357504a">Portfolio</text></svg>';

const initialGallery: GalleryItem[] = [
  {
    id: 1,
    title: 'Návrat k přirozenosti',
    description:
      'Odstranění starého nánosu barvy a vytvoření jemného, přirozeného prosvětlení, které nevyžaduje složitou údržbu.',
    category: 'Proměna',
    date: '10. 6. 2026',
    status: 'published',
    imageUrl: placeholderImage,
  },
  {
    id: 2,
    title: 'Čistá linie',
    description:
      'Zkrácení a provzdušnění. Cílem bylo, aby vlasy držely tvar jen po lehkém prosušení.',
    category: 'Střih',
    date: '5. 6. 2026',
    status: 'published',
    imageUrl: placeholderImage,
  },
];

export default function AdminGallery() {
  const [gallery] = useState<GalleryItem[]>(initialGallery);
  const [isUploading, setIsUploading] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistState>({
    lighting: false,
    education: false,
    minimalism: false,
    clientConsent: false,
  });

  const isChecklistComplete = Object.values(checklist).every(Boolean);

  const handleChecklistToggle = (key: keyof ChecklistState) => {
    setChecklist((currentChecklist) => ({
      ...currentChecklist,
      [key]: !currentChecklist[key],
    }));
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 font-sans text-stone-900 md:flex-row">
      <aside className="flex w-full flex-col gap-6 bg-stone-900 p-6 text-stone-300 md:w-64">
        <h2 className="mb-4 text-xl font-light text-white">
          Radím s vlasy <br />
          <span className="text-sm text-stone-500">Admin prostor</span>
        </h2>
        <nav className="flex flex-col gap-3">
          <a href="/admin/reservations" className="flex items-center gap-2 p-2 transition-colors hover:text-white">
            <Clock size={18} /> Žádosti o konzultaci
          </a>
          <a href="/admin/appointments" className="flex items-center gap-2 p-2 transition-colors hover:text-white">
            <Users size={18} /> Moji klienti
          </a>
          <a href="/admin/gallery" className="flex items-center gap-2 rounded-md bg-stone-800 p-2 text-white transition-colors">
            <ImageIcon size={18} /> Správa portfolia
          </a>
          <a href="/admin/analytics" className="flex items-center gap-2 p-2 transition-colors hover:text-white">
            <BarChart3 size={18} /> Analytika funnelů
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between border-b border-stone-200 pb-6">
            <div>
              <h1 className="mb-1 text-2xl font-medium">Vizuální identita a portfolio</h1>
              <p className="text-sm text-stone-500">
                Prostor pro prezentaci tvé práce. Čistě, elegantně a s respektem k řemeslu.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploading((isCurrentlyUploading) => !isCurrentlyUploading)}
              className="flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm text-stone-50 transition-colors hover:bg-stone-800"
            >
              {isUploading ? <X size={16} /> : <Plus size={16} />}
              {isUploading ? 'Zrušit nahrávání' : 'Nová práce'}
            </button>
          </div>

          {isUploading && (
            <div className="mb-10 rounded-lg border border-stone-200 bg-white p-8 shadow-sm duration-300 animate-in fade-in slide-in-from-top-4">
              <h2 className="mb-6 text-lg font-medium">Příprava nového obsahu</h2>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                  <button
                    type="button"
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50/50 p-10 text-stone-500 transition-colors hover:bg-stone-50"
                  >
                    <Upload size={32} className="mb-3 text-stone-400" />
                    <span className="text-sm font-medium">Klikni pro nahrání fotografií</span>
                    <span className="mt-1 text-xs">Ideálně formát 4:5 (Instagram) • Max 5MB</span>
                  </button>

                  <div>
                    <label htmlFor="transformation-title" className="mb-2 block text-sm text-stone-500">
                      Název proměny
                    </label>
                    <input
                      id="transformation-title"
                      type="text"
                      placeholder="Např. Návrat k přirozenosti..."
                      className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="hair-story" className="mb-2 block text-sm text-stone-500">
                      Příběh za vlasy (Edukace pro klienty)
                    </label>
                    <textarea
                      id="hair-story"
                      rows={4}
                      placeholder="Popiš, co jste s klientkou řešili a proč jste zvolili tento postup..."
                      className="w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-stone-900">
                    <CheckSquare size={16} className="text-stone-500" /> Předpublikační SOP
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-stone-500">
                    Každá fotka tvoří tvou značku. Zkontroluj, zda tento výstup splňuje naše estetické a komunikační standardy.
                  </p>

                  <div className="space-y-4">
                    {[
                      ['lighting', 'Přirozené světlo a reálná textura', 'Nepoužil jsem vyhlazovací filtry ani nepřirozené kruhové světlo, které zkresluje barvu.'],
                      ['education', 'Hodnota a smysl', 'Popisek nevychloubá techniku, ale vysvětluje, jak tento styl usnadní klientce život.'],
                      ['minimalism', 'Minimalismus a čistota', 'Pozadí neruší. Estetika odpovídá našemu "méně kvantity, více kvality".'],
                      ['clientConsent', 'Souhlas klientky', 'Mám jasný souhlas se zveřejněním tohoto příběhu a fotografií.'],
                    ].map(([key, title, description]) => (
                      <label key={key} className="group flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checklist[key as keyof ChecklistState]}
                          onChange={() => handleChecklistToggle(key as keyof ChecklistState)}
                          className="mt-1 accent-stone-800"
                        />
                        <span>
                          <span className="block text-sm font-medium text-stone-800 group-hover:text-stone-900">{title}</span>
                          <span className="block text-xs text-stone-500">{description}</span>
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={!isChecklistComplete}
                    className={`mt-8 w-full rounded-md py-3 text-sm font-medium transition-all duration-300 ${
                      isChecklistComplete
                        ? 'bg-stone-900 text-stone-50 shadow-md hover:bg-stone-800'
                        : 'cursor-not-allowed bg-stone-200 text-stone-400'
                    }`}
                  >
                    Publikovat do portfolia
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 flex items-center justify-center gap-4 bg-stone-900/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button type="button" className="rounded-full bg-white p-2 text-stone-900 transition-colors hover:bg-stone-100">
                      <Edit3 size={18} />
                    </button>
                    <button type="button" className="rounded-full bg-white p-2 text-red-600 transition-colors hover:bg-red-50">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-stone-900">{item.title}</h3>
                    <span className="rounded-md bg-stone-100 px-2 py-1 text-xs text-stone-600">{item.category}</span>
                  </div>
                  <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-stone-500">{item.description}</p>
                  <div className="flex items-center gap-1 text-xs font-light text-stone-400">
                    <Clock size={12} /> Publikováno {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
