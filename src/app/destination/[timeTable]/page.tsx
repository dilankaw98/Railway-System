"use client";

import Card from "@/components/card";
import timetableDummyData from "@/data/timetableDummy";
import Link from "next/link";


export interface PageProps {
  params: Promise<{
    timeTable: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TimeTablePage(props: PageProps) {
  const { params, searchParams } = props;
  const { timeTable } = await params;
  const resolvedSearchParams = await searchParams;
  console.log("TimeTable:", timeTable);

  const data = timetableDummyData.find(
    (destination) => destination.name === timeTable
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-3">
            Trains to {timeTable}
          </h1>
          <p className="text-blue-800 text-lg">
            Choose your preferred train from the available options
          </p>
        </div>

        {data?.timeTable.length === 0 ? (
          <div className="text-center bg-white rounded-xl p-12 shadow-lg border border-blue-100">
            <svg
              className="mx-auto h-16 w-16 text-blue-600 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-blue-900 mb-3">
              No Trains Available
            </h2>
            <p className="text-blue-600 max-w-md mx-auto">
              We couldn't find any trains for this destination at the moment.
              Please check back later or try a different destination.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.timeTable.map((train, index) => (
              <Link
                href={`/destination/${timeTable}/${train.id}`}
                passHref
                className="transform transition-all hover:scale-105 duration-300"
              >
                <Card className="h-full rounded-xl bg-white border border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-lg">
                  <div className="p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-semibold text-blue-900">
                          {train.trainName}
                        </h2>
                        <p className="text-blue-600 text-sm mt-1">
                          Train ID: {train.id}
                        </p>
                      </div>
                      <span className="px-4 py-1.5 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
                        Platform {train.platForm || "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-blue-700 bg-blue-50 p-3 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-lg font-medium">
                        {train.timeSlot || "N/A"}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
