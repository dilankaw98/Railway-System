"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import image1 from "../../public/assets/pngtree-black-and-white-tickets-png-image_9021897.png";

export default function Niv() {
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("user");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      const result = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Log out",
      });
      if (result.isConfirmed) {
        try {
          localStorage.removeItem("user");
          localStorage.removeItem("id");
          router.push("/login");
        } catch (error) {
          console.error("Error during handleLogout: ", error);
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src={image1}
              alt="Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="text-white font-bold text-xl">Railway Platform</span>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {email && (
              <div className="flex items-center space-x-4">
                <Link
                  href="/home"
                  className="px-4 py-2 text-white font-semibold hover:bg-blue-800 rounded-md transition duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/recharge"
                  className="px-4 py-2 text-white font-semibold hover:bg-blue-800 rounded-md transition duration-300"
                >
                  Recharge
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white font-semibold bg-blue-700 hover:bg-blue-800 rounded-md transition duration-300 ml-4"
                >
                  Log out
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-blue-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          {email && (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/home"
                className="block px-3 py-2 text-white font-medium hover:bg-blue-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/recharge"
                className="block px-3 py-2 text-white font-medium hover:bg-blue-800 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Recharge
              </Link>
              <button
                onClick={(e) => {
                  setIsMenuOpen(false);
                  handleLogout(e);
                }}
                className="w-full text-left px-3 py-2 text-white font-medium bg-blue-700 hover:bg-blue-800 rounded-md"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
