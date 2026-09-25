"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("home.features");
  const features = t.raw("items") || [];

  return (
    <section className="section-y bg-gray-50">
      <div className="shell">
        <h2 className="text-center text-3xl font-bold text-brand-500 sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.08 }}
              /* `h-full` inside a grid cell makes every card match the tallest
                 one in its row, so the ragged card bottoms are gone. */
              className="flex h-full flex-col items-center rounded-2xl bg-white p-7 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div aria-hidden="true" className="text-4xl sm:text-5xl">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-balance text-brand-800">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
