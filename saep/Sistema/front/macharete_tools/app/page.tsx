"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      {/* HERO */}
      <section className="flex-1 flex items-center justify-center text-center px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-rose-700 tracking-tight">
            ProTools
          </h1>

          <p className="mt-4 text-gray-600 text-lg md:text-xl leading-relaxed">
            Uma plataforma moderna e intuitiva para organizar produtos, gerenciar estoque 
            e otimizar o fluxo operacional da sua empresa. Simples, rápida e eficiente — 
            tudo em um só lugar.
          </p>

        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-white py-16 px-6 border-t border-rose-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-rose-700 text-center">
            Por que escolher ProTools?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
              <h3 className="font-semibold text-rose-700 text-lg">Controle Total</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Acompanhe produtos em tempo real, veja mínimos, alertas e atualize com poucos cliques.
              </p>
            </div>

            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
              <h3 className="font-semibold text-rose-700 text-lg">Interface Intuitiva</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Design minimalista pensado para velocidade e clareza. Nada de telas poluídas.
              </p>
            </div>

            <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
              <h3 className="font-semibold text-rose-700 text-lg">Economia de Tempo</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Cadastre, edite, exclua e organize tudo em segundos — produtividade no máximo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTO */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-gray-600 text-lg italic">
            “Desde que começamos a usar o ProTools, o controle de produtos ficou muito mais simples.
            A equipe inteira agradece.”
          </p>
          <p className="mt-4 text-rose-700 font-semibold">— Equipe de Operações</p>
        </div>
      </section>

      {/* CALL TO ACTION FINAL */}
      <section className="py-12 bg-rose-100/40 text-center border-t border-rose-200">
        <h3 className="text-xl font-semibold text-rose-700">
          Pronto para otimizar sua gestão?
        </h3>
      </section>
    </div>
  );
}
