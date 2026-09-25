"use client";

import { Toaster } from "react-hot-toast";
import { MotionConfig } from "framer-motion";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/app/redux/store";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function ClientWrapper({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* The site leans on scroll and hover motion; honour the OS setting. */}
        {/* Column layout keeps the footer at the bottom on short pages
            instead of floating halfway up the viewport. */}
        <MotionConfig reducedMotion="user">
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </MotionConfig>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              maxWidth: "min(92vw, 30rem)",
              borderRadius: "0.875rem",
              padding: "0.75rem 1rem",
              fontSize: "0.9375rem",
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
}
