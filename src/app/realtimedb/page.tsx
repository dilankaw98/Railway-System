"use client";
import { useState, useEffect } from "react";
import { rtdb } from "../../../firebaseconfig";
import { ref, push, set, onValue, off } from "firebase/database";

export default function RFIDPage() {
  const [rfid, setRfid] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [lastScannedRfid, setLastScannedRfid] = useState("");

  useEffect(() => {
    const rfidRef = ref(rtdb, "rfid");

    const handleCardTap = onValue(rfidRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const entries = Object.entries(data);

        if (entries.length > 0) {
          const [id, cardData] = entries[entries.length - 1] as [string, any];

          if (cardData.value !== lastScannedRfid) {
            setLastScannedRfid(cardData.value);
            console.log(`Card tapped: ${cardData.value}`);
            setMessage({
              text: `Card detected! RFID: ${cardData.value}`,
              type: "success",
            });
          }
        }
      }
    });

    return () => {
      off(rfidRef, "value", handleCardTap);
    };
  }, [lastScannedRfid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rfid.trim()) {
      setMessage({ text: "Please enter an RFID value", type: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      const rfidRef = ref(rtdb, "rfid/current");
      await set(rfidRef, {
        value: rfid,
        status: "true",
      });

      setRfid("");
      setMessage({ text: "RFID value updated successfully!", type: "success" });
    } catch (error) {
      console.error("Error updating RFID:", error);
      setMessage({
        text: "Failed to update RFID value. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">RFID Entry Form</h1>

      {message.text && (
        <div
          className={`p-3 mb-4 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {lastScannedRfid && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          Last scanned RFID: {lastScannedRfid}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="rfid" className="block text-sm font-medium mb-1">
            RFID Value
          </label>
          <input
            type="text"
            id="rfid"
            value={rfid}
            onChange={(e) => setRfid(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter RFID value"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}