

"use client";
import React from "react";
import { motion } from "framer-motion";
import { Leaf, Sprout, AlertTriangle, Brain } from "lucide-react";
import { useTranslations } from "next-intl";

const AboutPage = () => {
  const t = useTranslations("aboutPage");

  const problems = t.raw("problems.items") || [];

  return (
    <section className="bg-gradient-to-b from-green-50 to-yellow-50 text-gray-800 overflow-hidden">
      <section className="relative bg-gradient-to-b from-green-50 to-yellow-50">

        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: "url('/assets/new.jpeg')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>


        <div className="relative z-10 flex flex-col items-center justify-center text-center h-[65vh] px-6 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-200 max-w-2xl"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </section>


      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 py-20 text-center"
      >
        <h2 className="text-4xl font-bold text-green-800 mb-4 flex justify-center items-center gap-2">
          <Sprout className="text-green-600 w-8 h-8" /> {t("mission.title")}
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg max-w-6xl mx-auto">
          {t("mission.description")}
        </p>
      </motion.div>


      <div className="py-20 bg-gradient-to-r from-green-100 via-yellow-50 to-green-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          <div className="w-full h-[400px] md:h-[500px]">
            <motion.img
              src="/assets/we.jpg"
              alt="AI Detection"
              className="rounded-3xl bg-white shadow-2xl object-cover w-full h-full"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <Brain className="text-green-600 w-8 h-8" /> {t("whatWeDo.title")}
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              {t("whatWeDo.description")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-green-800 mb-8 flex justify-center items-center gap-2"
          >
            <AlertTriangle className="text-yellow-500 w-8 h-8" /> {t("problems.title")}
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-green-50 hover:bg-green-100 transition p-6 rounded-2xl shadow-md border border-green-100"
              >
                <h3 className="font-semibold text-green-800 text-xl mb-2">
                  {problem.title}
                </h3>
                <p className="text-gray-700">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

  
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-6 text-center bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            {t("vision.title")}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            {t("vision.description")}
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutPage;