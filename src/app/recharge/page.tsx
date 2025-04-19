"use client";
import React, { useEffect, useState } from "react";
import NIV from "@/components/niv";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import image3 from "../../../public/assets/visa-logo.png";
import image4 from "../../../public/assets/mc-logo.png";
import image5 from "../../../public/assets/up-logo.png";
import Swal from "sweetalert2";
import { db } from "../../../firebaseconfig";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  setDoc,
} from "firebase/firestore";
import { ref } from "firebase/storage";
import Footer from "@/components/footer";

function CustomerPayment() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [usdAmount, setUsdAmount] = useState(0);
  const exchangeRateAPI = "https://api.exchangerate-api.com/v4/latest/LKR";
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [docid, setDocid] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [currentWalletBalance, setCurrentWalletBalance] = useState(0);

  useEffect(() => {
    const userEmail = localStorage.getItem("user");
    console.log(userEmail);
    if (userEmail) {
      setEmail(userEmail);
    }

    const storedUserId = localStorage.getItem("id");
    console.log(storedUserId);
    if (storedUserId) {
      setUserId(storedUserId);
      fetchWalletBalance(storedUserId);
    }
  }, []);

  const fetchWalletBalance = async (uid: string) => {
    try {
      const walletRef = doc(db, "Wallet", uid);
      const walletSnap = await getDoc(walletRef);

      if (walletSnap.exists()) {
        setCurrentWalletBalance(walletSnap.data().balance || 0);
      } else {
        await setDoc(walletRef, {
          balance: 0,
          userId: uid,
          createdAt: new Date(),
        });
        setCurrentWalletBalance(0);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  const handleProceedToPay = async () => {
    if (!isChecked) {
      Swal.fire({
        title: "Attention!",
        text: "Please accept the Terms and Conditions to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!firstname || !lastname || !phone || !email || !walletAmount) {
      Swal.fire({
        icon: "error",
        title: "Required fields are missing",
        text: "Please fill in all required fields including wallet amount",
      });
      return;
    }

    const newAmount = parseFloat(walletAmount);
    const newBalance = currentWalletBalance + newAmount;

    if (newBalance > 50000) {
      Swal.fire({
        icon: "error",
        title: "Amount Exceeded",
        text: "Wallet balance cannot exceed 50,000 LKR",
      });
      return;
    }

    const amountInUSD = newAmount / 300;
    setUsdAmount(amountInUSD);

    const paymentDocRef = await addDoc(collection(db, `Payment/`), {
      firstname,
      lastname,
      phone,
      email,
      accountName,
      accountNumber,
      cvv,
      expiryDate,
      walletAmount: newAmount,
      status: "pending",
      timestamp: new Date(),
      userId: userId,
    });
    const docId = paymentDocRef.id;
    setDocid(docId);

    setShowPayPal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <NIV />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-blue-50 p-6">
            <h2 className="text-2xl font-bold text-blue-900 text-center mb-2">
              Current Wallet Balance
            </h2>
            <p className="text-5xl font-bold text-blue-800 text-center">
              {currentWalletBalance.toLocaleString()} LKR
            </p>
            <p className="text-blue-600 text-sm text-center mt-2">
              Maximum balance limit: 50,000 LKR
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Billing Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="First Name"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      placeholder="Last Name"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    readOnly
                    className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Email"
                    value={email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-1">
                    Wallet Amount (LKR)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    placeholder="Enter amount"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">
                    Optional Card Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        placeholder="Account Name"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-800 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">
                Payment Summary
              </h2>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Accepted Payment Methods
                </h3>
                <div className="flex space-x-6">
                  <Image
                    src={image3}
                    alt="visa logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <Image
                    src={image4}
                    alt="mc logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                  <Image
                    src={image5}
                    alt="up logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-2 border-blue-200 rounded focus:ring-blue-400"
                  />
                  <label htmlFor="remember" className="text-sm text-blue-600">
                    I accept and agree to{" "}
                    <a className="text-blue-700 font-semibold hover:underline">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>

              <button
                onClick={handleProceedToPay}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Proceed To Pay
              </button>

              {showPayPal && (
                <div className="mt-6">
                  <PayPalScriptProvider
                    options={{
                      clientId:
                        "AV1lVPkzz8BBkxfIe69wGR2hYtgilYx-XnXpv0ENcBmUMPiTxd_6iTnv0tiLK7VLmr1auPXUwEB0qKGB",
                    }}
                  >
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [
                            {
                              amount: {
                                currency_code: "USD",
                                value: usdAmount.toFixed(2),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={async (data, actions: any) => {
                        return actions.order
                          .capture()
                          .then(async (details: any) => {
                            try {
                              const paymentRef = doc(db, "Payment", docid);
                              await updateDoc(paymentRef, {
                                status: "completed",
                                paypalOrderId: data.orderID,
                                paypalPayerId: details.payer.payer_id,
                                completedAt: new Date(),
                              });

                              const walletRef = doc(db, "Wallet", userId);
                              const walletSnap = await getDoc(walletRef);
                              const currentBalance = walletSnap.exists()
                                ? walletSnap.data().balance
                                : 0;
                              const newBalance =
                                currentBalance + parseFloat(walletAmount);

                              await updateDoc(walletRef, {
                                balance: newBalance,
                                lastUpdated: new Date(),
                              });

                              await addDoc(
                                collection(db, "WalletTransactions"),
                                {
                                  userId,
                                  amount: parseFloat(walletAmount),
                                  type: "deposit",
                                  paymentId: docid,
                                  timestamp: new Date(),
                                  balance: newBalance,
                                }
                              );

                              Swal.fire({
                                title: "Transaction Completed!",
                                text: `Successfully added ${walletAmount} LKR to your wallet. New balance: ${newBalance} LKR`,
                                icon: "success",
                                confirmButtonText: "OK",
                              }).then(() => {
                                router.push("/home");
                              });
                            } catch (error) {
                              console.error("Error updating wallet:", error);
                              Swal.fire({
                                title: "Error",
                                text: "There was an error updating your wallet. Please contact support.",
                                icon: "error",
                                confirmButtonText: "OK",
                              });
                            }
                          });
                      }}
                      onError={(err) => {
                        console.error("PayPal Checkout Error:", err);
                        Swal.fire({
                          title: "Payment Failed",
                          text: "Please try again.",
                          icon: "error",
                          confirmButtonText: "OK",
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default CustomerPayment;
