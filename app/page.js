import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

const spotlightPhotos = [
  {
    title: "Bright/Single rooms",
    subtitle: "Clean, secure spaces with study corners",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Shared hostel vibes.",
    subtitle: "Easygoing living with modern amenities",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Comfortable bedsitters",
    subtitle: "Private, practical homes near campus",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
  },
];

const features = [
  {
    title: "Verified listings",
    text: "Every listing is reviewed so you can browse with confidence.",
  },
  {
    title: "Fast contact",
    text: "Start a conversation with landlords in just a tap.",
  },
  {
    title: "Saved favorites",
    text: "Bookmark rooms you love and come back anytime.",
  },
];

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const county = params?.county || "";
  const propertyType = params?.type || "";

  // TEMP: bypass Prisma DB query to diagnose blank page issue.
  // If this renders, the problem is likely a blocking DB call.
  const listings = [];

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f6f8fb_0%,#eef2f4_50%,#f7f3ea_100%)] text-[#142430]">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-full border border-[#D3DCE0] bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-lg font-semibold text-[#142430]">Hostel Hub</p>
            <p className="text-sm text-gray-500">Verified rooms, hostels and bedsitters</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a href="/saved" className="font-medium text-[#2568A8] transition hover:text-[#1a4f77]">
              Saved
            </a>
            <a href="/login" className="rounded-full border border-[#D3DCE0] px-3 py-1.5 font-medium text-[#142430] transition hover:border-[#2568A8] hover:text-[#2568A8]">
              Log in
            </a>
          </div>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-[28px] border border-[#D3DCE0] bg-white/80 p-6 shadow-[0_20px_60px_-20px_rgba(20,36,48,0.24)] backdrop-blur sm:p-8">
            <div className="mb-4 inline-flex rounded-full border border-[#2568A8]/20 bg-[#EAF4FB] px-3 py-1 text-sm font-medium text-[#2568A8]">
              New spaces every week
            </div>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Discover your next home near campus.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Browse verified hostels, bedsitters, and private rooms with real photos, quick contact options, and trusted landlords.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#listings" className="rounded-full bg-[#2568A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f5687]">
                Browse listings
              </a>
              <a href="/signup" className="rounded-full border border-[#D3DCE0] px-5 py-2.5 text-sm font-semibold text-[#142430] transition hover:border-[#2568A8] hover:text-[#2568A8]">
                Create account
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { value: "200+", label: "Verified rooms" },
                { value: "24/7", label: "Fast inquiry" },
                { value: "4.9/5", label: "User rating" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-[#D3DCE0] bg-[#F9FBFC] p-3">
                  <p className="text-xl font-semibold text-[#142430]">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <form className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-[#D3DCE0] bg-[#F9FBFC] p-3" method="GET">
              <select name="county" defaultValue={county} className="min-w-[140px] rounded-xl border border-[#D3DCE0] bg-white px-3 py-2 text-sm text-[#142430]">
                <option value="">All counties</option>
                <option value="Nairobi">Nairobi</option>
                <option value="Kiambu">Kiambu</option>
                <option value="Machakos">Machakos</option>
              </select>

              <select name="type" defaultValue={propertyType} className="min-w-[160px] rounded-xl border border-[#D3DCE0] bg-white px-3 py-2 text-sm text-[#142430]">
                <option value="">Property type</option>
                <option value="BEDSITTER">Bedsitter</option>
                <option value="HOSTEL_ROOM">Hostel room</option>
                <option value="ONE_BEDROOM">1 bedroom</option>
              </select>

              <button type="submit" className="rounded-xl bg-[#2568A8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1f5687]">
                Search now
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[28px] border border-[#D3DCE0] bg-white shadow-[0_20px_60px_-20px_rgba(20,36,48,0.24)]">
              <img
                src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80"
                alt="Modern hostel room with cozy bed and study desk"
                className="h-72 w-full object-cover"
              />
              <div className="flex items-center justify-between bg-[#142430] px-4 py-3 text-white">
                <div>
                  <p className="font-semibold">Student-friendly comfort</p>
                  <p className="text-sm text-slate-300">Private rooms with Wi-Fi and study space</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">Popular</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {spotlightPhotos.map((photo) => (
                <div key={photo.title} className="overflow-hidden rounded-[24px] border border-[#D3DCE0] bg-white shadow-sm transition hover:-translate-y-1">
                  <img src={photo.image} alt={photo.title} className="h-36 w-full object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-[#142430]">{photo.title}</p>
                    <p className="text-sm text-gray-500">{photo.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-[24px] border border-[#D3DCE0] bg-white/80 p-5 shadow-sm backdrop-blur">
              <p className="text-lg font-semibold text-[#142430]">{feature.title}</p>
              <p className="mt-2 text-sm text-gray-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="listings" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2568A8]">Featured spaces</p>
            <h2 className="text-2xl font-semibold text-[#142430]">Pick a place that feels like home</h2>
          </div>
          <p className="text-sm text-gray-500">Fresh listings from trusted landlords near you.</p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#D3DCE0] bg-white/70 p-8 text-center text-gray-500">
            No listings match yet — try a different county or check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
