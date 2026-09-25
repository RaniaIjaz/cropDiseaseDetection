"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const STEPS = [
  { key: "step1", image: "/assets/work1.png" },
  { key: "step2", image: "/assets/work2.png" },
  { key: "step3", image: "/assets/work3.png" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Works() {
  const t = useTranslations("home.works");

  return (
    <section className="section-y bg-white">
      <div className="shell">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="text-center text-3xl font-bold text-balance text-brand-500 sm:text-4xl lg:text-[2.75rem]"
        >
          {t("title")}
        </motion.h2>

        <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-20">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.key}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
            >
              {/* Copy. `md:order-2` on the even rows alternates the layout
                  without flex-row-reverse, so the DOM order (and therefore the
                  reading order on mobile) stays image-after-text throughout. */}
              <div className={index % 2 === 1 ? "md:order-2" : undefined}>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-400 p-3">
                    <Image
                      src="/assets/leaf.png"
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </span>
                  <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
                    {t(`${step.key}.stepNumber`)}
                  </p>
                </div>

                {/* Heading and body align to the icon, not to an arbitrary
                    `pl-20` that only applied from `lg` up. */}
                <h3 className="mt-5 text-2xl font-semibold text-balance text-ink sm:text-3xl">
                  {t(`${step.key}.heading`)}
                </h3>
                <p className="mt-3 max-w-prose leading-relaxed text-ink-muted text-pretty">
                  {t(`${step.key}.description`)}
                </p>
              </div>

              <div className={index % 2 === 1 ? "md:order-1" : undefined}>
                <Image
                  src={step.image}
                  alt=""
                  width={560}
                  height={420}
                  sizes="(max-width: 768px) 90vw, 45vw"
                  /* Capped height keeps the three rows a similar size; without
                     it the portrait illustrations opened large vertical gaps. */
                  className="mx-auto h-auto max-h-64 w-full max-w-sm object-contain sm:max-h-72 md:max-w-md lg:max-h-80"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
