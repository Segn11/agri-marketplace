import { Sprout } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-sm text-gray-600">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Sprout className="h-5 w-5 text-green-700" />
          <span className="font-semibold text-gray-900">Agricultural Marketplace</span>
          <span className="text-gray-400">|</span>
          <span>Connecting Farmers & Buyers in Nekemte</span>
        </div>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Agricultural Marketplace. Built with Next.js & Spring Boot.
        </p>
      </div>
    </footer>
  );
}
