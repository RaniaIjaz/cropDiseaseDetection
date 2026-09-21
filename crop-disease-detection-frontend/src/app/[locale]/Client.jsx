// "use client";

// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "../redux/store"; 
// import { Toaster } from "react-hot-toast";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function ClientLayout({ children }) {
//   return (
//     <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//       <Toaster position="top-center" />
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <Navbar />
//           {children}
//           <Footer />
//         </PersistGate>
//       </Provider>
//     </div>
//   );
// }

// src/app/[locale]/ClientWrapper.jsx
"use client";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/redux/store";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import "../globals.css";


export default function ClientWrapper({ children }) {
  return (
    <>
      <Toaster position="top-center" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navbar />
          {children}
          <Footer />
        </PersistGate>
      </Provider>
    </>
  );
}