import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { Event } from "@/lib/storage/types";

type FormField = {
  name: string;
  date: string;
  time: string;
  location: string;
  maxPlayers: string;
  priceTotal: string;
  creator: string;
};

type FormErrors = Partial<Record<keyof FormField, string>>;

const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center">
      <motion.div
        className="text-8xl mb-8"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ⚽
      </motion.div>
      <motion.h2
        className="text-2xl font-bold text-white mb-4"
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Setting Up Your Game...
      </motion.h2>
      <p className="text-gray-400">Organizing the perfect 5-a-side...</p>
    </div>
  </motion.div>
);

export const CreateEventModal = ({
  initialData,
  onClose,
  onSubmit,
  isSubmitting = false,
}: {
  initialData?: Event;
  onClose: () => void;
  onSubmit: (data: FormField) => Promise<void>;
  isSubmitting?: boolean;
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormField>(() => {
    if (initialData) {
      const [date, time] = initialData.date.split("T");
      return {
        name: initialData.name,
        date,
        time,
        location: initialData.location,
        maxPlayers: initialData.maxPlayers.toString(),
        priceTotal: initialData.priceTotal.toString(),
        creator: initialData.creator,
      };
    }
    return {
      name: "",
      date: "",
      time: "",
      location: "",
      maxPlayers: "10",
      priceTotal: "",
      creator: "",
    };
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [fieldsTouched, setFieldsTouched] = useState<Set<string>>(new Set());

  const validateField = (name: keyof FormField, value: string) => {
    switch (name) {
      case "name":
        return value.length < 3 ? "Give it a proper name, mate" : "";
      case "date":
        return !value ? "When are we playing?" : "";
      case "location":
        return value.length < 3 ? "Where's the battle happening?" : "";
      case "priceTotal":
        return isNaN(Number(value)) ? "Numbers only, chief" : "";
      case "creator":
        return value.length < 2 ? "Who's the gaffer?" : "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldsTouched((prev) => new Set(prev).add(name));
    const error = validateField(name as keyof FormField, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return !errors.name && formData.name && formData.date && formData.time;
      case 2:
        return (
          !errors.location &&
          !errors.priceTotal &&
          formData.location &&
          formData.priceTotal
        );
      case 3:
        return !errors.creator && formData.creator;
      default:
        return false;
    }
  };

  const progressPercentage = [
    (fieldsTouched.size / Object.keys(formData).length) * 100,
    Object.keys(errors).length === 0 ? 100 : 75,
    isSubmitting ? 100 : 90,
  ][step - 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-[#333]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <motion.div
          className="h-2 bg-[#FF2E00]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-[#FF2E00] via-[#FF8C00] to-[#FFD600]">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <pattern
                id="pinstripe"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
              <rect width="100%" height="100%" fill="url(#pinstripe)" />
            </svg>
          </div>

          <div className="relative flex justify-between items-center">
            {/* <h2 className="text-2xl font-bold text-white">
              {initialData ? "Edit Your Game" : "Create Your Game"}
            </h2> */}
            <h2 className="text-2xl font-bold text-white">
              {step === 1
                ? "The Basics"
                : step === 2
                ? "The Details"
                : "The Captain"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Steps */}
        <div className="p-6 text-white">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-lg font-bold">
                    Name your match
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g., Saturday Morning Madness"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] focus:border-[#FF2E00] 
                             outline-none transition-colors text-white placeholder-gray-500"
                  />
                  {errors.name && fieldsTouched.has("name") && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#FF2E00] text-sm"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block font-bold">Kickoff Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] focus:border-[#FF2E00] 
                               outline-none transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-bold">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] focus:border-[#FF2E00] 
                               outline-none transition-colors text-white"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-lg font-bold">
                    Where's the pitch?
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g., Powerleague Shoreditch"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] focus:border-[#FF2E00] 
                             outline-none transition-colors text-white placeholder-gray-500"
                  />
                  {errors.location && fieldsTouched.has("location") && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#FF2E00] text-sm"
                    >
                      {errors.location}
                    </motion.p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-lg font-bold">
                    Pitch Fee (£)
                  </label>
                  <input
                    type="number"
                    name="priceTotal"
                    placeholder="50"
                    value={formData.priceTotal}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] focus:border-[#FF2E00] 
                             outline-none transition-colors text-white placeholder-gray-500"
                  />
                  {errors.priceTotal && fieldsTouched.has("priceTotal") && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#FF2E00] text-sm"
                    >
                      {errors.priceTotal}
                    </motion.p>
                  )}
                  {formData.priceTotal && !errors.priceTotal && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-gray-400 text-sm"
                    >
                      That's £{(Number(formData.priceTotal) / 10).toFixed(2)}{" "}
                      per player (assuming 10 players)
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-lg font-bold">
                    Your Name (The Boss)
                  </label>
                  <input
                    type="text"
                    name="creator"
                    placeholder="Enter your name"
                    value={formData.creator}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] focus:border-[#FF2E00] 
                             outline-none transition-colors text-white placeholder-gray-500"
                  />
                  {errors.creator && fieldsTouched.has("creator") && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#FF2E00] text-sm"
                    >
                      {errors.creator}
                    </motion.p>
                  )}
                </div>

                <div className="p-4 bg-[#222] rounded-lg border border-[#333]">
                  <h3 className="font-bold mb-3 text-lg">Game Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-400">Event:</span>{" "}
                      {formData.name}
                    </p>
                    <p>
                      <span className="text-gray-400">When:</span>{" "}
                      {formData.date} at {formData.time}
                    </p>
                    <p>
                      <span className="text-gray-400">Where:</span>{" "}
                      {formData.location}
                    </p>
                    <p>
                      <span className="text-gray-400">Cost:</span> £
                      {formData.priceTotal}
                    </p>
                    <p>
                      <span className="text-gray-400">Captain:</span>{" "}
                      {formData.creator}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            {/* Similar motion.div patterns for steps 2 and 3... */}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between pt-6 mt-6 border-t border-[#333]">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Back
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (step < 3) {
                  setStep((s) => s + 1);
                } else {
                  onSubmit(formData);
                }
              }}
              disabled={!isStepValid(step) || isSubmitting}
              className={`ml-auto px-6 py-3 rounded-lg flex items-center gap-2 font-bold
                         ${
                           isStepValid(step)
                             ? "bg-[#FF2E00] hover:bg-[#FF4D00]"
                             : "bg-gray-700 cursor-not-allowed"
                         }`}
            >
              {step === 3 ? (
                initialData ? (
                  isSubmitting ? (
                    "Updating..."
                  ) : (
                    "Update Game"
                  )
                ) : isSubmitting ? (
                  "Creating..."
                ) : (
                  "Create Game"
                )
              ) : (
                <>
                  Next
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Loading Screen */}
      <AnimatePresence>{isSubmitting && <LoadingScreen />}</AnimatePresence>
    </motion.div>
  );
};
