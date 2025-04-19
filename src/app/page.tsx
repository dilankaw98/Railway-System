"use client";
import Image from "next/image";
import image1 from "../../public/assets/tick.jpg";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <main className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex flex-col items-center px-4">
      <div className="text-center mt-16">
        <h1 className="font-extrabold text-5xl md:text-6xl leading-tight drop-shadow-md">
          <span className="text-blue-900">RAILWAY</span>{" "}
          <span className="text-blue-800">SRI LANKA</span>
        </h1>
        <h2 className="font-semibold text-2xl md:text-3xl text-blue-600 mt-2 tracking-wide drop-shadow-sm">
          RAILWAY.COM
        </h2>
      </div>

      <div className="relative w-full max-w-6xl h-[300px] md:h-[500px] mt-10 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          className="object-cover"
          src={image1}
          alt="Sri Lanka Exploration"
          layout="fill"
        />
      </div>

      <div className="text-center mt-8 mb-10">
        <button
          className="bg-blue-600 text-white text-lg font-bold rounded-full px-10 py-3 shadow-lg hover:bg-blue-700 hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          onClick={handleClick}
        >
          LET'S GO
        </button>
      </div>
    </main>
  );
}
