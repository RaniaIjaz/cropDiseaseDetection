// "use client";
// import { motion } from "framer-motion";

// const features = [
//   {
//     title: "Fast & Accurate",
//     desc: "AI detection in seconds with high precision.",
//     icon: "⚡",
//   },
//   {
//     title: "Crop Support",
//     desc: "Specialized for Wheat & Cotton farmers.",
//     icon: "🌾",
//   },
//   {
//     title: "Solution Suggestions",
//     desc: "Actionable tips to cure and prevent diseases.",
//     icon: "💡",
//   },
//   {
//     title: "Web Based",
//     desc: "Access from anywhere, on any device.",
//     icon: "🌍",
//   },
// ];

// export default function Features() {
//   return (
//     <section className="bg-gray-50 py-20 px-6 text-center">
//       <h2 className="text-4xl font-bold text-[#3d9970]">Features</h2>

//       <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
//         {features.map((feature, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: i * 0.2 }}
//             className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
//           >
//             <div className="text-5xl mb-4">{feature.icon}</div>
//             <h3 className="text-xl font-semibold text-[#2F5F48]">
//               {feature.title}
//             </h3>
//             <p className="mt-3 text-gray-600">{feature.desc}</p>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }



"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Features() {
  const t = useTranslations("home.features");
  
  // Get features array from translations
  const features = t.raw("items") || [];

  return (
    <section className="bg-gray-50 pb-20 px-6 text-center">
      <h2 className="text-4xl font-bold text-[#3d9970]">
        {t("title")}
      </h2>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-[#2F5F48]">
              {feature.title}
            </h3>
            <p className="mt-3 text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}