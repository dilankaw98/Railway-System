import Card from "@/components/card";
import timetableDummyData from "@/data/timetableDummy";
import Link from "next/link";
import { FaTrain, FaChair, FaStar, FaInfoCircle } from "react-icons/fa";


export interface PageProps {
  params: {
    timeTable: string;
    ticketClass: string;
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ timeTable: string; ticketClass: string }>;
}) {
  const { timeTable, ticketClass } = await params;
  console.log("TimeTable:", timeTable);
  console.log("TicketClass:", ticketClass);

  const data = timetableDummyData.find(
    (destination) => destination.name === timeTable
  );

  const trainData = data?.timeTable.find((train) => train.id === ticketClass);

  const ticketClassesNo = trainData?.ticketClassNo || [];

  const basePrice = trainData?.price || 0; 

  const calculatePrice = (ticket: number) => {
    if (ticket === 1) return basePrice * 2;
    if (ticket === 2) return basePrice / 2 + basePrice;
    return basePrice; // ticket === 3
  };

  const getClassInfo = (ticket: number) => {
    switch (ticket) {
      case 1:
        return {
          description: "First Class - Premium comfort with spacious seating and exclusive amenities",
          features: ["Spacious seating", "Air conditioning", "Premium service", "Priority boarding"],
          stars: 5
        };
      case 2:
        return {
          description: "Second Class - Comfortable seating with good legroom",
          features: ["Comfortable seating", "Air conditioning", "Standard service", "Regular boarding"],
          stars: 3
        };
      case 3:
        return {
          description: "Third Class - Standard seating with essential amenities",
          features: ["Standard seating", "Basic amenities", "Regular service", "Standard boarding"],
          stars: 1
        };
      default:
        return {
          description: "Standard seating",
          features: ["Basic seating", "Essential amenities"],
          stars: 1
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <FaTrain className="text-blue-600 text-5xl" />
          </div>
          <h1 className="text-blue-900 text-4xl font-bold mb-2">
            Select Your Ticket Class
          </h1>
          <p className="text-blue-800 text-lg">
            Choose the class that best suits your travel needs
          </p>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6">
          {ticketClassesNo.map((ticket, index) => {
            const classInfo = getClassInfo(ticket);
            return (
              <Link
                key={index}
                href={`/destination/${timeTable}/${ticketClass}/${calculatePrice(ticket)}`}
                passHref
                className="transform transition-transform hover:scale-105"
              >
                <Card className="h-full rounded-xl p-6 bg-white backdrop-blur-sm border border-blue-100 hover:border-blue-200 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-2xl font-bold text-blue-900">
                          Class {ticket}
                        </h2>
                        <div className="flex text-blue-600">
                          {[...Array(classInfo.stars)].map((_, i) => (
                            <FaStar key={i} className="text-blue-600" />
                          ))}
                        </div>
                      </div>
                      <p className="text-blue-800 text-sm mb-4">
                        {classInfo.description}
                      </p>
                      <div className="space-y-2">
                        {classInfo.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-blue-600 text-sm">
                            <FaChair className="mr-2 text-blue-600" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="text-blue-900">
                          <span className="text-sm">Price per ticket</span>
                          <div className="text-xl font-semibold">
                            {calculatePrice(ticket).toLocaleString()} LKR
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-blue-600 flex items-center">
                        <FaInfoCircle className="mr-1" />
                        <span>Click to proceed with booking</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
