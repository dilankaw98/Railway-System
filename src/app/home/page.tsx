import { Inter } from "next/font/google";
import NIV from "@/components/niv";
import Footer from "@/components/footer";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <NIV />

      <div className="relative bg-white min-h-[90vh] mt-16 border border-blue-100 flex flex-col justify-center items-center px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 bg-[url('/platform-pattern.png')] opacity-10"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 hover:text-blue-700 transition-colors">
            WELCOME TO
          </h1>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-800 mt-3 md:mt-5 hover:text-blue-700 transition-colors">
            RAILWAY PLATFORM
          </h2>
          
          <p className="mt-6 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Book your train tickets quickly and easily with our user-friendly platform.
          </p>
        </div>
        
        <div className="mt-12 md:mt-16 relative z-10 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4">Popular Destinations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["Jaffna", "Colombo", "Kandy", "Galle"].map((city) => (
                <div key={city} className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  {city}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
