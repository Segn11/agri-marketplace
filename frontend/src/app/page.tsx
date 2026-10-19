import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, TrendingUp, Users, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const categories = [
    { name: "Cereals & Grains", slug: "cereals-grains", count: "Teff, Wheat, Maize" },
    { name: "Vegetables", slug: "vegetables", count: "Onions, Tomatoes, Greens" },
    { name: "Fruits", slug: "fruits", count: "Avocados, Bananas, Mangoes" },
    { name: "Pulses & Seeds", slug: "pulses-oilseeds", count: "Beans, Lentils, Sesame" },
    { name: "Coffee & Spices", slug: "coffee-spices", count: "Highland Coffee, Ginger" },
    { name: "Dairy & Poultry", slug: "dairy-poultry", count: "Milk, Eggs, Butter" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-stone-50 py-16 sm:py-24 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full bg-green-100 px-3.5 py-1 text-xs font-semibold text-green-800 mb-6">
              Empowering Nekemte & Oromia Farmers
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Fresh Produce Directly From <span className="text-green-700">Local Farmers</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Eliminate intermediaries. Discover fair market prices, order directly from verified local growers, and enjoy fresh agricultural harvests.
            </p>

            {/* Quick Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto bg-white p-2 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center flex-1 w-full px-3">
                <Search className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search Teff, Onions, Coffee, Avocado..."
                  className="w-full text-sm text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none"
                />
              </div>
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="md" className="w-full sm:w-auto">
                  Find Produce
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <span>Popular:</span>
              <span className="bg-gray-200/60 px-2.5 py-1 rounded-md">Magna Teff</span>
              <span className="bg-gray-200/60 px-2.5 py-1 rounded-md">Red Onions</span>
              <span className="bg-gray-200/60 px-2.5 py-1 rounded-md">Nekemte Coffee</span>
              <span className="bg-gray-200/60 px-2.5 py-1 rounded-md">Avocados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Explore by Category</h2>
            <p className="text-sm text-gray-500 mt-1">Browse fresh farm produce harvested in our region</p>
          </div>
          <Link href="/products" className="mt-3 sm:mt-0 text-sm font-semibold text-green-700 hover:text-green-800 flex items-center">
            View all categories <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-green-600 hover:shadow-md transition duration-200"
            >
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start p-6 rounded-xl bg-stone-50">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700 mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Fair Price Discovery</h3>
              <p className="text-sm text-gray-600 mt-2">
                Farmers set their own prices transparently, avoiding broker cuts and helping buyers compare market rates effortlessly.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 rounded-xl bg-stone-50">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Direct Contact & Verification</h3>
              <p className="text-sm text-gray-600 mt-2">
                Once an order is accepted, both farmer and buyer receive direct contact details to coordinate seamless payment and pickup.
              </p>
            </div>

            <div className="flex flex-col items-start p-6 rounded-xl bg-stone-50">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center text-green-700 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Community Trust & Ratings</h3>
              <p className="text-sm text-gray-600 mt-2">
                Verified reviews left by buyers after completed orders foster accountability and celebrate our most dedicated producers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
