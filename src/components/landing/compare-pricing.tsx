'use client'

import { Fragment } from 'react'
import { FaCheck } from "react-icons/fa6";

interface Plan {
  name: string
}

interface Row {
  label: string
  values: (string | number | boolean)[]
}

interface Section {
  title: string
  rows: Row[]
}

const PLANS: Plan[] = [ { name: 'Intermedio' }, { name: 'Premium' }]

const TABLE: Section[] = [
  {
    title: 'Bot',
    rows: [
        { label: 'Respuestas / mes', values: [300, 'Unlimited'] },
        { label: 'Fotos, audios, videos, texto', values: [true, true] },
        { label: 'Razonamiento con IA', values: [true, true] },
      { label: 'Canales conectados', values: [true, true] },
      { label: 'Preguntas frecuentes / Otros datos', values: [true, true] },
      { label: 'Links de pago automáticos', values: [true, true] },
    ],
  },
  {
    title: 'Tienda',
    rows: [
      { label: 'Productos', values: ['Ilimitados', 'Ilimitados'] },
      { label: 'Links de pago manuales', values: ['Ilimitados', 'Ilimitados'] },
      { label: 'Pedidos maximos por mes', values: ['Ilimitados', 'Ilimitados'] },
      { label: 'Comision por pedido', values: ['2.5%', '0%'] },
      { label: 'Soporte por email', values: [true, true] },
      { label: 'Integracion con plataformas', values: [true, true] },
      { label: 'Tienda en linea', values: [true, true] },
    ],
  },
]

export default function ComparisonTable() {
  return (
    <section className="bg-[var(--background)] py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="ticker inline-flex items-center gap-2 rounded-2xl bg-background px-4 py-2 border border-border rotate-[-2deg] shadow-[0_10px_25px_rgba(2,132,199,0.12)] text-2xl font-bold text-foreground">
            Comparar planes
          </h2>
        </div>

        <div className="overflow-x-auto border border-b-0 border rounded-lg shadow-lg">
          <table className="min-w-full border-collapse text-sm text-left">
            <thead>
              <tr>
                <th className="px-4 py-3 text-gray-1100 font-medium text-lg">Planes</th>
                {PLANS.map((plan) => (
                  <th key={plan.name} className="px-4 py-3 text-gray-1100 font-medium text-center text-lg">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-500">
              {TABLE.map((section, si) => (
                <Fragment key={si}>
                  {/* Section title */}
                  <tr className="bg-[var(--accent)] border-t border-b border-border">
                    <td colSpan={PLANS.length + 1} className="px-4 py-3  text-foreground">
                      {section.title}
                    </td>
                  </tr>

                  {section.rows.map((row, ri) => (
                    <tr key={ri} className={'hover:bg-[var(--accent)] border-b border-border'}>
                      <td className="px-4 py-3 text-foreground">{row.label}</td>
                      {row.values.map((val, pi) => (
                        <td key={pi} className="px-4 py-3 text-center text-muted-foreground">
                          {typeof val === 'boolean' ? (
                            val ? (
                              <FaCheck className="text-[#2563EB] align-middle text-center w-full" />
                            ) : (
                              <FaCheck className="text-gray-400 align-middle text-center w-full" />
                            )
                          ) : (
                            val
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
