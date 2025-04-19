"use client";
import Card from "@/components/card";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { db } from "../../../../../../firebaseconfig";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";


export interface PageProps {
  params: {
    timeTable: string;
    ticketClass: string;
    ticket: string;
  };
}

export default function Page({
  params,
}: {
  params: { timeTable: string; ticketClass: string; ticket: string };
}) {
  const { timeTable, ticketClass, ticket } = params;
  const [layout, setLayout] = useState<string>("default");
  const [input, setInput] = useState<string>("");
  const keyboard = useRef<any>(null);
  const router = useRouter();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    console.log(timeTable, ticketClass, ticket);
  }, [timeTable, ticketClass, ticket]);

  const onChange = (input: string) => {
    const numericInput = input.replace(/\D/g, "");
    setInput(numericInput);
  };

  const onKeyPress = async (button: string) => {
    if (button === "{shift}" || button === "{lock}") handleShift();
    if (button === "{enter}") await handleEnter();
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const handleEnter = async () => {
    if (!input || parseInt(input) <= 0) {
      Swal.fire({
        title: "Invalid Input",
        text: "Please enter a valid number of tickets",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      console.log(timeTable, ticketClass, ticket, input);
      const link = document.createElement('a');
      link.href = `/destination/${timeTable}/${ticketClass}/${ticket}/${input}`;
      link.click();
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("id");
    console.log(storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6 border border-blue-100">
          <h1 className="text-blue-900 text-3xl font-bold text-center mb-4 drop-shadow-sm">
            How Many Tickets Do You Need?
          </h1>
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100">
            <div className="flex justify-between items-center">
              <span className="text-blue-800 text-xl">Selected Tickets:</span>
              <span className="text-blue-900 text-3xl font-bold">{input || '0'}</span>
            </div>
            <div className="mt-2">
              <span className="text-blue-800 text-lg">Total Amount: </span>
              <span className="text-blue-900 text-2xl font-bold">
                {input ? (parseInt(input) * parseInt(ticket)).toLocaleString() : '0'} LKR
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-4 border border-blue-100">
          <Keyboard
            className="keyboard w-100 bg-white text-blue-900"
            keyboardRef={(r) => (keyboard.current = r)}
            layoutName={layout}
            onChange={onChange}
            onKeyPress={onKeyPress}
            layout={{
              default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp} {enter}"],
            }}
          />
        </div>
      </div>

      <style>
        {`
            .hg-button {
                background: white !important;
                color: #1e40af !important;
                border: 1px solid #bfdbfe !important;
                border-radius: 8px !important;
                transition: all 0.2s ease !important;
                font-size: 1.2rem !important;
                font-weight: bold !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
            }

            .hg-button:hover {
                background: #eff6ff !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                border-color: #93c5fd !important;
            }

            .hg-button:active {
                background: #dbeafe !important;
                transform: translateY(0);
            }

            .simple-keyboard {
                background: white;
                border-radius: 12px;
                padding: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .simple-keyboard .hg-button {
                background: white;
                color: #1e40af;
                height: 8vh;
                margin: 4px;
            }

            .simple-keyboard .hg-button:active,
            .simple-keyboard .hg-button:hover {
                background: #eff6ff;
            }

            .simple-keyboard .hg-button[data-skbtn="{enter}"] {
                background: #2563eb !important;
                color: white !important;
                font-weight: bold !important;
            }

            .simple-keyboard .hg-button[data-skbtn="{bksp}"] {
                background: #f3f4f6 !important;
                color: #1e40af !important;
            }

            @media (max-width: 640px) {
                .simple-keyboard .hg-button {
                    height: 6vh;
                    font-size: 1rem !important;
                }
            }
            `}
      </style>
    </div>
  );
}
