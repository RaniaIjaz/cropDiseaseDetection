"use client";
import Link from "next/link";
import Hero from "@/app/components/Home/Hero";
import Work from "@/app/components/Home/Works";
import Features from "@/app/components/Home/Features";
import About from "@/app/components/Home/About";

export default function HomePage() {
  return (
    <main className="min-h-screen">

<Hero/>
<Work/>
<About/>
<Features/>

      {/* <section className="bg-gray-50 py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800">Quick FAQs</h2>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold text-green-600">How accurate is detection?</h3>
            <p className="text-gray-600">Our AI models achieve high accuracy with properly trained datasets.</p>
          </div>
          <div>
            <h3 className="font-semibold text-green-600">Do I need to install an app?</h3>
            <p className="text-gray-600">No, this system is fully web-based.</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/faqs"
            className="text-green-600 font-semibold hover:underline"
          >
            View All FAQs →
          </Link>
        </div>
      </section>

      
      <section className="bg-green-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold">Have Questions?</h2>
        <p className="mt-4 text-lg">We’d love to hear from you.</p>
        <div className="mt-6">
          <Link
            href="/contact"
            className="bg-white text-green-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100"
          >
            Contact Us
          </Link>
        </div>
      </section> */}
    </main>
  );
}

