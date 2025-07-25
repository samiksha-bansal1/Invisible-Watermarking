// src/components/HeroSection.js - REVISED ATTEMPT
import React from "react";
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative isolate px-6 pt-24 lg:px-8 text-center min-h-[80vh] flex items-center justify-center" // Removed overflow-hidden for now
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-2xl py-20 sm:py-24 lg:py-28">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Learn more about digital watermarking technology.{" "}
            <Link
              to="/about-markproof"
              className="font-semibold text-indigo-600"
            >
              <span aria-hidden="true" className="absolute inset-0" />
              Read more <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Prove Your Mark: Challenge the Unseen Digital Signature
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Upload an image, embed a hidden message, and put your watermark to
            the test. Apply real-world distortions like blur, crop, and
            compression to see how robust your digital signature truly is.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/upload-section"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get Started Now
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              How it Works <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* MODIFIED: Adjusted top value more carefully */}
      {/* Increased the 'pull-up' value slightly to prevent overflow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-15rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-35rem)]" // Adjusted from 13rem to 15rem, and 30rem to 35rem
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </section>
  );
}

export default HeroSection;
