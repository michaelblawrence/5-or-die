import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight, PoundSterling } from "lucide-react";
import { PaymentButton } from "./PaymentButton";

const steps = {
  JOIN: "join",
  PAYMENT_INFO: "payment",
} as const;

type Step = (typeof steps)[keyof typeof steps];

export function WelcomeDialog({
  onJoin,
  togglePaymentStatus,
  onClose,
  isEventFull,
  isPending = false,
  pricePerPerson,
}: {
  onJoin: (name: string) => boolean;
  togglePaymentStatus: (name: string) => boolean;
  onClose: () => void;
  isEventFull: boolean;
  isPending?: boolean;
  pricePerPerson: number;
}) {
  const [step, setStep] = useState<Step>(steps.JOIN);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter your name to join");
      return;
    }
    try {
      const success = onJoin(name.trim());
      if (!success) {
        setError("Someone with this name has already joined!");
        return;
      }
      setStep(steps.PAYMENT_INFO);
    } catch (err) {
      setError("Failed to join game. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md bg-[#1A1A1A] rounded-xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          {step === steps.JOIN && (
            <motion.div
              key="join"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold mb-6">Playing this week?</h2>

              {isEventFull ? (
                <div className="text-[#FF2E00] py-4">
                  Sorry, this game is full!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError(null);
                      }}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-[#222] border-2 border-[#333] rounded-lg 
                               focus:border-[#FF2E00] outline-none transition-colors"
                      disabled={isPending}
                    />
                    {error && (
                      <p className="text-sm text-[#FF2E00] mt-1">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF2E00] text-white px-6 py-3 
                             rounded-lg font-bold hover:bg-[#FF4D00] transition-colors disabled:opacity-50"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Game"
                    )}
                  </button>

                  <p className="text-sm text-gray-400">
                    You can still view the game details without joining
                  </p>
                </form>
              )}
            </motion.div>
          )}

          {step === steps.PAYMENT_INFO && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <h2 className="text-2xl font-bold mb-4">Almost Done!</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <PoundSterling className="w-6 h-6 text-[#FF2E00]" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Payment Required</h3>
                    <p className="text-gray-400">
                      Your share is £{pricePerPerson}. Pay the captain and mark
                      yourself as paid.
                    </p>
                  </div>
                </div>

                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-sm text-gray-400">
                      Already paid? Click the button below
                    </span>
                  </div>
                  <PaymentButton
                    hasPaid={isPaid}
                    pricePerPerson={pricePerPerson}
                    onClick={() => {
                      const hasPaid = togglePaymentStatus(name);
                      setIsPaid(hasPaid);
                    }}
                  />

                  <div className="flex items-center justify-center mt-2">
                    <span className="text-sm text-gray-500">
                      You can come back anytime to mark yourself as paid
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 
                           rounded-lg font-bold hover:bg-white/20 transition-colors"
                >
                  Got it
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
