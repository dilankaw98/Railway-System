"use client";
import Card from "@/components/card";
import Link from "next/link";
import destinationsDummyData from "@/data/destinationsDummy";
import { useState } from "react";

export default function Destination() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDestinations = destinationsDummyData.filter((destination) =>
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Select Your Destination
          </h1>
          <p className="text-blue-800 text-lg mb-8">
            Choose from our carefully curated list of destinations
          </p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full bg-white border-2 border-blue-200 text-blue-900 placeholder-blue-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <p className="text-blue-700 text-sm mt-2">
              Found {filteredDestinations.length} destinations
            </p>
          )}
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((destination, index) => (
              <div key={index} className="group transform transition-all duration-300 hover:scale-105">
                <Link href={`/destination/${destination.name}`} passHref>
                  <Card className="rounded-2xl bg-white shadow-lg hover:shadow-xl border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                    <div className="p-8">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors duration-300">
                          <span className="text-blue-600 text-2xl">🚂</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-blue-900 text-center mb-2">
                          {destination.name}
                        </h2>
                        <div className="w-20 h-1 bg-blue-400 rounded-full mb-4"></div>
                        <div className="flex items-center text-blue-600 text-sm group-hover:text-blue-700 transition-colors duration-300">
                          <span>Explore destination</span>
                          <svg 
                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-blue-900 text-lg">
                No destinations found matching "{searchQuery}"
              </p>
              <p className="text-blue-600 text-sm mt-2">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
        <div className="mt-16 text-center">
          <p className="text-blue-600 text-sm">
            Need help? Contact our support team at support@railway.com
          </p>
        </div>
      </div>
    </div>
  );
}
