import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Hero Sekce */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
          Radím s vlasy.
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mb-10 font-light leading-relaxed">
          Kadeřnictví není jen o trendech. Je to o tobě, tvé cestě a vlasech,
          které dávají smysl. Zastav se, nadechni se a pojďme najít styl, ve
          kterém se budeš cítit opravdu dobře.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/aura"
            className="bg-stone-900 text-stone-50 px-8 py-3 rounded-md hover:bg-stone-800 transition-colors duration-300"
          >
            Chci online konzultaci
          </Link>
          <a
            href="#muj-pribeh"
            className="border border-stone-300 text-stone-900 px-8 py-3 rounded-md hover:bg-stone-100 transition-colors duration-300"
          >
            Můj příběh
          </a>
        </div>
      </section>

      {/* Sekce O mně (Manifest) */}
      <section id="muj-pribeh" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-light mb-6">Nejde jen o řemeslo.</h2>
            <p className="text-stone-600 mb-4 leading-relaxed">
              Vlasy jsou kronikou našich životních období. Nesou v sobě radosti,
              bolesti i proměny. Ve Znojmě buduji místo, kde se estetika
              propojuje s lidskostí.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Střih vnímám jako symbol proměny. Konzultaci jako dialog. Žádný
              tlak na rychlé ranní foukání, ale přirozenost, která tě podrží.
            </p>
          </div>
          <div className="md:w-1/2 bg-stone-200 aspect-square rounded-lg flex items-center justify-center text-center px-8">
            {/* Zde bude tvá autentická, klidná fotka ze salonu */}
            <span className="text-stone-500">
              [Místo pro elegantní fotku salonu]
            </span>
          </div>
        </div>
      </section>

      {/* Footer / Rychlý kontakt */}
      <footer className="py-12 bg-stone-900 text-stone-400 text-center text-sm px-6">
        <p>© 2026 Radím s vlasy. Všechna práva vyhrazena.</p>
        <p className="mt-2">Znojmo | Vlasy jako sebevyjádření</p>
      </footer>
    </div>
  );
}
