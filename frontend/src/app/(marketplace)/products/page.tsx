"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const mockProducts = [
    {
      id: "p1",
      name: "Premium White Teff (Magna)",
      categoryName: "Cereals & Grains",
      description: "First-grade organic high-purity Teff freshly harvested from East Wollega.",
      unitPrice: 9500,
      unit: "Quintal (100kg)",
      quantityAvailable: 45,
      location: "Guto Gida, Nekemte",
      farmerName: "Gemechu Desta",
      status: "ACTIVE",
    },
    {
      id: "p2",
      name: "Fresh Red Onions",
      categoryName: "Vegetables",
      description: "Dry, high-quality cooking onions ready for immediate bulk delivery.",
      unitPrice: 85,
      unit: "KG",
      quantityAvailable: 1200,
      location: "Diga, Nekemte",
      farmerName: "Chala Tolosa",
      status: "ACTIVE",
    },
    {
      id: "p3",
      name: "Organic Forest Coffee (Wollega Grade 1)",
      categoryName: "Coffee & Spices",
      description: "Sun-dried washed specialty Arabica beans directly from our shade forest grove.",
      unitPrice: 420,
      unit: "KG",
      quantityAvailable: 350,
      location: "Nekemte Highland",
      farmerName: "Tigist Bekele",
      status: "ACTIVE",
    },
    {
      id: "p4",
      name: "Fresh Hass Avocados",
      categoryName: "Fruits",
      description: "Creamy, naturally grown export-quality avocados.",
      unitPrice: 90,
      unit: "KG",
      quantityAvailable: 500,
      location: "Wayu Tuka",
      farmerName: "Abebe Megersa",
      status: "ACTIVE",
    },
  ];

  const filtered = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Agricultural Produce Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse verified listings from farmers in Nekemte and neighbouring zones.
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search produce or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <Badge variant="success">{product.categoryName}</Badge>
              <span className="text-xs text-gray-500 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                {product.location}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-green-700">
                  {formatCurrency(product.unitPrice)}
                </span>
                <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
              </div>
              <span className="text-xs font-medium text-gray-600">
                Stock: {product.quantityAvailable} {product.unit}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Farmer: <strong>{product.farmerName}</strong></span>
            </div>

            <Link href={`/login`} className="mt-4">
              <Button size="sm" className="w-full">
                Place Order
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
