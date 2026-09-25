"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sprout, AlertTriangle, Brain } from "lucide-react";
import { useTranslations } from "next-intl";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

/** Icon sits above the heading so a wrapped two-line title never leaves it
 *  dangling mid-air beside the text. */
const SectionHeading = ({ icon: Icon, iconClass, children, align = "center" }) => (
  <h2
    className={`flex flex-col gap-2 text-3xl font-bold text-balance text-brand-800 sm:text-4xl ${
      align === "center" ? "items-center text-center" : "items-start"
    }`}
  >
    <Icon className={`h-8 w-8 shrink-0 ${iconClass}`} aria-hidden="true" />
    <span>{children}</span>
  </h2>
);

const AboutPage = () => {
  const t = useTranslations("aboutPage");
  const problems = t.raw("problems.items") || [];

  return (
    <div className="overflow-hidden bg-white text-gray-800">
      {/* Hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/new.jpeg')" }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/45 to-black/60" />
        </div>

        <div className="relative z-10 flex min-h-[26rem] flex-col items-center justify-center px-6 py-20 text-center sm:min-h-[28rem] md:px-12 lg:min-h-[32rem]">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-3xl leading-tight font-extrabold text-balance text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="mt-5 max-w-2xl text-base text-white/90 text-pretty sm:text-lg md:text-xl"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="section-y bg-gradient-to-b from-brand-50 to-amber-50/40"
      >
        <div className="shell max-w-4xl text-center">
          <SectionHeading icon={Sprout} iconClass="text-brand-600">
            {t("mission.title")}
          </SectionHeading>
          <p className="mt-5 text-base leading-relaxed text-gray-700 text-pretty sm:text-lg">
            {t("mission.description")}
          </p>
        </div>
      </motion.section>

      {/* What we do */}
      <section className="section-y bg-gradient-to-r from-brand-100 via-amber-50 to-brand-100">
        <div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <motion.img
            src="/assets/we.jpg"
            alt=""
            loading="lazy"
            className="h-64 w-full rounded-3xl bg-white object-cover shadow-2xl sm:h-80 md:h-[26rem]"
            initial={{ opacity: 0, x: -48 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.25 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 48 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <SectionHeading icon={Brain} iconClass="text-brand-600" align="start">
              {t("whatWeDo.title")}
            </SectionHeading>
            <p className="mt-5 text-base leading-relaxed text-gray-700 text-pretty sm:text-lg">
              {t("whatWeDo.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problems */}
      <section className="section-y bg-white">
        <div className="shell">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionHeading icon={AlertTriangle} iconClass="text-gold-500">
              {t("problems.title")}
            </SectionHeading>
          </motion.div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.07 }}
                viewport={{ once: true, amount: 0.2 }}
                className="h-full rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center shadow-sm transition-colors hover:bg-brand-100"
              >
                <h3 className="text-lg font-semibold text-balance text-brand-800">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700 text-pretty">
                  {problem.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="section-y bg-brand-50"
      >
        <div className="shell max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-balance text-brand-800 sm:text-4xl">
            {t("vision.title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-700 text-pretty sm:text-lg">
            {t("vision.description")}
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
