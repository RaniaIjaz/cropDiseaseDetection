


// "use client";
// import Image from "next/image";
// import { motion } from "framer-motion";

// const fadeInUp = {
//   hidden: { opacity: 0, y: 60 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
//   }),
// };

// export default function Works() {
//   return (
//     <section className="py-16 px-10 overflow-hidden">
//       <div className="mx-auto flex flex-col px-4">
//         <motion.h2
//           className="text-[48px] font-semibold text-center text-[#3d9970] mb-16 md:mb-6"
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}
//         >
//           How It Works
//         </motion.h2>

//         {/* Step 1 */}
//         <motion.div
//           className="flex flex-col md:flex-row items-center relative"
//           custom={1}
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}
//         >
//           <motion.div
//             className="md:w-1/2 px-0 lg:px-10 mb-8 md:mb-0 z-10"
//             whileHover={{ scale: 1.03 }}
//             transition={{ type: "spring", stiffness: 200 }}
//           >
//             <div className="flex items-start space-x-6 mb-4">
//               <div className="bg-[#aec597] rounded-full p-2 w-[58px] h-[58px]">
//                 <Image
//                   src="/assets/leaf.png"
//                   alt="leaf"
//                   width={80}
//                   height={80}
//                   className="w-full object-cover"
//                 />
//               </div>
//               <div className="flex flex-col mt-4">
//                 <p className="text-[17px] text-black font-semibold">Step 1</p>
//               </div>
//             </div>

//             <h3 className="text-[30px] text-black lg:pl-20 font-semibold mb-4">
//               Upload Picture
//             </h3>
//             <p className="text-[#545454] lg:pl-20 text-[16px] max-w-md mb-4">
//               Upload a clear photo of a wheat or cotton leaf (good lighting, close-up of
//               the affected area). High-quality images yield more accurate results.
//               Avoid blurry shots and try capturing different angles.
//             </p>
//           </motion.div>

//           <motion.div
//             className="md:w-1/2 sm:pl-8 lg:pl-[10vh] z-10"
//             custom={2}
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}
//             whileHover={{ scale: 1.05, rotate: 1 }}
//             transition={{ type: "spring", stiffness: 180 }}
//           >
//             <Image
//               src="/assets/work1.png"
//               alt="Work step 1"
//               width={400}
//               height={100}
//               className="object-contain"
//             />
//           </motion.div>
//         </motion.div>

//         {/* Step 2 */}
//         <motion.div
//           className="flex flex-col z-10 mb-10 lg:gap-4 md:flex-row-reverse items-center"
//           custom={3}
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}
//         >
//           <motion.div
//             className="md:w-1/2 mb-8 md:mb-0 md:pl-12"
//             whileHover={{ scale: 1.03 }}
//             transition={{ type: "spring", stiffness: 200 }}
//           >
//             <div className="flex items-start space-x-6 mb-4">
//               <div className="bg-[#aec597] rounded-full p-2 w-[58px] h-[58px]">
//                 <Image
//                   src="/assets/leaf.png"
//                   alt="leaf"
//                   width={50}
//                   height={50}
//                   className="w-full object-cover"
//                 />
//               </div>
//               <div className="flex flex-col mt-4">
//                 <p className="text-[17px] text-black font-semibold">Step 2</p>
//               </div>
//             </div>

//             <h3 className="text-[30px] lg:pl-20 text-black font-semibold mb-4">
//               AI-Powered Disease Detection
//             </h3>
//             <p className="text-[#545454] lg:pl-20 text-[16px] max-w-md sm:max-w-[500px] mb-4">
//               Our AI analyzes the uploaded image, compares it with trained samples,
//               and instantly identifies the disease. It highlights patterns like
//               discoloration, fungal spots, and texture variations with high accuracy.
//             </p>
//           </motion.div>

//           <motion.div
//             className="md:w-1/2"
//             custom={4}
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}
//             whileHover={{ scale: 1.05, rotate: -1 }}
//             transition={{ type: "spring", stiffness: 180 }}
//           >
//             <Image
//               src="/assets/work2.png"
//               alt="Work step 2"
//               width={450}
//               height={450}
//               className="object-contain"
//             />
//           </motion.div>
//         </motion.div>

//         {/* Step 3 */}
//         <motion.div
//           className="flex flex-col lg:gap-4 md:flex-row items-center relative"
//           custom={5}
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}
//         >
//           <motion.div
//             className="md:w-1/2 px-0 lg:px-10 mb-8 md:mb-0 z-10"
//             whileHover={{ scale: 1.03 }}
//             transition={{ type: "spring", stiffness: 200 }}
//           >
//             <div className="flex items-start space-x-6 mb-4">
//               <div className="bg-[#aec597] rounded-full p-2 w-[58px] h-[58px]">
//                 <Image
//                   src="/assets/leaf.png"
//                   alt="leaf"
//                   width={50}
//                   height={50}
//                   className="w-full object-cover"
//                 />
//               </div>
//               <div className="flex flex-col mt-4">
//                 <p className="text-[17px] text-black font-semibold">Step 3</p>
//               </div>
//             </div>

//             <h3 className="text-[30px] lg:pl-20 text-black font-semibold mb-4">
//               Personalized Recommendations
//             </h3>
//             <p className="text-[#545454] lg:pl-20 text-[16px] max-w-md sm:max-w-[420px] mb-4">
//               Receive actionable treatment and prevention tips including chemical,
//               organic, and cultural practices to protect your crops and boost long-term
//               harvest health.
//             </p>
//           </motion.div>

//           <motion.div
//             className="md:w-1/2 sm:pl-8 lg:pl-[10vh] z-10"
//             custom={6}
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}
//             whileHover={{ scale: 1.05, rotate: 1 }}
//             transition={{ type: "spring", stiffness: 180 }}
//           >
//             <Image
//               src="/assets/work3.png"
//               alt="Work step 3"
//               width={500}
//               height={450}
//               className="object-contain"
//             />
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// }



"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Works() {
  const t = useTranslations("home.works");

  return (
    <section className="py-16 px-10 overflow-hidden">
      <div className="mx-auto flex flex-col px-4">
        <motion.h2
          className="text-[48px] font-semibold text-center text-[#3d9970] mb-16 md:mb-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {t("title")}
        </motion.h2>

        {/* Step 1 */}
        <motion.div
          className="flex flex-col md:flex-row items-center relative"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.div
            className="md:w-1/2 px-0 lg:px-10 mb-8 md:mb-0 z-10"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-start space-x-6 mb-4">
              <div className="bg-[#aec597] rounded-full p-2 w-[58px] h-[58px]">
                <Image
                  src="/assets/leaf.png"
                  alt="leaf"
                  width={80}
                  height={80}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col mt-4">
                <p className="text-[17px] text-black font-semibold">
                  {t("step1.stepNumber")}
                </p>
              </div>
            </div>

            <h3 className="text-[30px] text-black lg:pl-20 font-semibold mb-4">
              {t("step1.heading")}
            </h3>
            <p className="text-[#545454] lg:pl-20 text-[16px] max-w-md mb-4">
              {t("step1.description")}
            </p>
          </motion.div>

          <motion.div
            className="md:w-1/2 sm:pl-8 lg:pl-[10vh] z-10"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <Image
              src="/assets/work1.png"
              alt="Work step 1"
              width={400}
              height={100}
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="flex flex-col z-10 mb-10 lg:gap-4 md:flex-row-reverse items-center"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.div
            className="md:w-1/2 mb-8 md:mb-0 md:pl-12"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-start space-x-6 mb-4">
              <div className="bg-[#aec597] rounded-full p-2 w-[58px] h-[58px]">
                <Image
                  src="/assets/leaf.png"
                  alt="leaf"
                  width={50}
                  height={50}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col mt-4">
                <p className="text-[17px] text-black font-semibold">
                  {t("step2.stepNumber")}
                </p>
              </div>
            </div>

            <h3 className="text-[30px] lg:pl-20 text-black font-semibold mb-4">
              {t("step2.heading")}
            </h3>
            <p className="text-[#545454] lg:pl-20 text-[16px] max-w-md sm:max-w-[500px] mb-4">
              {t("step2.description")}
            </p>
          </motion.div>

          <motion.div
            className="md:w-1/2"
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            whileHover={{ scale: 1.05, rotate: -1 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <Image
              src="/assets/work2.png"
              alt="Work step 2"
              width={450}
              height={450}
              className="object-contain"
            />
          </motion.div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          className="flex flex-col lg:gap-4 md:flex-row items-center relative"
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.div
            className="md:w-1/2 px-0 lg:px-10 mb-8 md:mb-0 z-10"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="flex items-start space-x-6 mb-4">
              <div className="bg-[#aec597] rounded-full p-2 w-[58px] h-[58px]">
                <Image
                  src="/assets/leaf.png"
                  alt="leaf"
                  width={50}
                  height={50}
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col mt-4">
                <p className="text-[17px] text-black font-semibold">
                  {t("step3.stepNumber")}
                </p>
              </div>
            </div>

            <h3 className="text-[30px] lg:pl-20 text-black font-semibold mb-4">
              {t("step3.heading")}
            </h3>
            <p className="text-[#545454] lg:pl-20 text-[16px] max-w-md sm:max-w-[420px] mb-4">
              {t("step3.description")}
            </p>
          </motion.div>

          <motion.div
            className="md:w-1/2 sm:pl-8 lg:pl-[10vh] z-10"
            custom={6}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            whileHover={{ scale: 1.05, rotate: 1 }}
            transition={{ type: "spring", stiffness: 180 }}
          >
            <Image
              src="/assets/work3.png"
              alt="Work step 3"
              width={500}
              height={450}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}