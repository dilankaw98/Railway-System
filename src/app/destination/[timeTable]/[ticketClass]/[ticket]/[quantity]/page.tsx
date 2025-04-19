"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, rtdb } from "../../../../../../../firebaseconfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  onValue,
  push,
  update,
  get,
  off,
  DataSnapshot,
} from "firebase/database";
import Swal from "sweetalert2";
import timetableDummyData from "../../../../../../data/timetableDummy";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaHandPointer } from "react-icons/fa";
import type { PageProps } from "next";

interface RfidData {
  id: string;
  value?: string;
  timestamp?: number;
  status?: string;
  [key: string]: any;
}

export default function TicketDetailsPage(props: PageProps) {
  const [timeTable, setTimeTable] = useState("");
  const [ticketClass, setTicketClass] = useState("");
  const [ticket, setTicket] = useState("");
  const [quantity, setQuantity] = useState("");
  const router = useRouter();
  const [showBubble, setShowBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rfidData, setRfidData] = useState<RfidData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastProcessedId, setLastProcessedId] = useState<string | null>(null);
  const [isWaitingForCard, setIsWaitingForCard] = useState(false);

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await props.params;
      setTimeTable(resolvedParams.timeTable);
      setTicketClass(resolvedParams.ticketClass);
      setTicket(resolvedParams.ticket);
      if (resolvedParams.quantity) {
        setQuantity(resolvedParams.quantity);
      }
    };
    initializeParams();
  }, [props.params]);

  const destination = timetableDummyData.find(
    (dest) => dest.name === timeTable
  );

  const trainInfo = destination?.timeTable.find(
    (train) => train.id === ticketClass
  );

  const TrainName = trainInfo?.trainName;
  const TotalofTickets = parseInt(quantity) * parseInt(ticket);

  useEffect(() => {
    setIsWaitingForCard(true);
    setIsProcessing(false);
    setLastProcessedId(null);

    Swal.fire({
      title: "Waiting for Card",
      text: "Please tap your card to make payment",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const fetchInitialRfidData = async () => {
      try {
        const rfidRef = ref(rtdb, "rfid");
        const snapshot = await get(rfidRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const rfidEntries = Object.entries(data);
          if (rfidEntries.length > 0) {
            const lastEntry = rfidEntries[rfidEntries.length - 1];
            setLastProcessedId(lastEntry[0] as string);
          }
        }
      } catch (error) {
        console.error("Error fetching initial RFID data:", error);
      }
    };

    fetchInitialRfidData();

    return () => {
      Swal.close();
    };
  }, []);

  useEffect(() => {
    const rfidRef = ref(rtdb, "rfid");
    let initialLoad = true;
    let previousEntries = new Set();

    const handleRfidChange = async (snapshot: DataSnapshot) => {
      if (isProcessing) return;
      if (!isWaitingForCard) return;

      const data = snapshot.val();
      if (!data) return;

      if (data.current && data.current.status === "true") {
        console.log("Current RFID detected:", data.current.value);
        setLastProcessedId("current");
        setRfidData({
          id: "current",
          value: data.current.value,
          timestamp: data.current.timestamp,
          status: data.current.status,
        });
        processPayment("current", data.current);
        console.log(data.current);
        return;
      }

      Swal.fire({
        title: "Waiting for Card",
        text: "Please tap your card to make payment",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
    };

    const unsubscribe = onValue(rfidRef, handleRfidChange);

    return () => {
      off(rfidRef);
    };
  }, [
    isProcessing,
    lastProcessedId,
    TotalofTickets,
    timeTable,
    ticketClass,
    ticket,
    quantity,
    TrainName,
    isWaitingForCard,
  ]);

  const processPayment = async (autoId: string, rfidValue: RfidData) => {
    try {
      setIsProcessing(true);
      setShowBubble(false);
      setIsWaitingForCard(false);

      Swal.close();

      Swal.fire({
        title: "Processing Payment",
        text: "Please wait while we process your payment...",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const rfidNumber = rfidValue.value;

      if (!rfidNumber) {
        throw new Error("RFID value not found in card data");
      }

      console.log("Searching for RFID:", rfidNumber);

      const rfidRef = ref(rtdb, `rfid/${autoId}`);
      const rfidSnapshot = await get(rfidRef);

      if (!rfidSnapshot.exists() || !rfidSnapshot.val().status) {
        throw new Error("Card not activated. Please contact support.");
      }

      const userQuery = query(
        collection(db, "user"),
        where("rfid", "==", rfidNumber)
      );

      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        throw new Error("Card not recognized. Please contact support.");
      }

      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const uid = userDoc.id;
      setUserId(uid);
      console.log(userData);

      const walletRef = doc(db, "Wallet", uid);
      const walletSnapshot = await getDoc(walletRef);

      if (!walletSnapshot.exists()) {
        throw new Error("Wallet not found. Please contact support.");
      }

      const walletData = walletSnapshot.data();
      const balance = walletData.balance || 0;
      console.log(balance);

      if (balance < TotalofTickets) {
        throw new Error("Insufficient balance. Please top up your wallet.");
      }

      const ticketData = {
        userId: uid,
        userName: userData.uname,
        destination: timeTable,
        trainName: TrainName,
        ticketClass: ticketClass,
        ticketPrice: parseInt(ticket),
        quantity: parseInt(quantity),
        totalAmount: TotalofTickets,
        timestamp: new Date().toISOString(),
        status: "false",
      };

      const rfidTicketRef = ref(rtdb, `rfid/${autoId}`);
      await update(rfidTicketRef, ticketData);

      const newBalance = balance - TotalofTickets;
      await updateDoc(walletRef, {
        balance: newBalance,
      });

      Swal.fire({
        title: "Payment Successful!",
        text: `Rs. ${TotalofTickets} has been deducted from your wallet. New balance: Rs. ${newBalance}`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      }).then(() => {
        router.push(`/success?id=${autoId}`);
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      Swal.fire({
        title: "Payment Failed",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your payment.",
        icon: "error",
        confirmButtonText: "Try Again",
      }).then(() => {
        setIsProcessing(false);
        setShowBubble(true);
        setIsWaitingForCard(true);

        Swal.fire({
          title: "Waiting for Card",
          text: "Please tap your card to make payment",
          icon: "info",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      });
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl p-6 border border-blue-100"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-900 text-3xl font-bold text-center mb-8"
          >
            Your Ticket
          </motion.h1>

          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="relative bg-blue-50 p-8 rounded-lg border-2 border-blue-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-400"
            >
              <AnimatePresence>
                {showBubble && !isWaitingForCard && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-900 px-6 py-3 rounded-2xl shadow-lg"
                  >
                    <div className="relative">
                      <motion.span
                        className="text-sm font-semibold flex items-center"
                        animate={{
                          scale: [1, 1.05, 1],
                          transition: {
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          },
                        }}
                      >
                        <FaHandPointer className="mr-2 text-lg text-blue-600" />
                        Tap your card to pay
                      </motion.span>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-blue-100"></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute inset-0 bg-blue-100/10 rounded-lg flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-blue-50 p-4 rounded-full"
                    >
                      <FaCreditCard className="text-3xl text-blue-600" />
                    </motion.div>
                  </motion.div>
                }
              </AnimatePresence>

              <div className="absolute top-0 left-0 w-6 h-6 bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-blue-400 rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 bg-blue-400 rounded-full -translate-x-1/2 translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-400 rounded-full translate-x-1/2 translate-y-1/2"></div>

              <div className="relative z-10">
                <motion.div
                  className="flex justify-between items-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-blue-800 text-2xl font-semibold flex items-center">
                    <span className="mr-3">🚂</span>
                    {TrainName}
                  </h2>
                  <span className="text-blue-800 font-bold text-2xl">
                    Rs. {TotalofTickets}
                  </span>
                </motion.div>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                    <span className="text-blue-600 text-lg">Destination</span>
                    <span className="text-blue-600 font-semibold text-lg">
                      {timeTable}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-blue-200 pb-4">
                    <span className="text-blue-600 text-lg">Ticket Price</span>
                    <span className="text-blue-600 font-semibold text-lg">
                      Rs. {ticket}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 text-lg">Quantity</span>
                    <span className="text-blue-600 font-semibold text-lg">
                      {quantity}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}