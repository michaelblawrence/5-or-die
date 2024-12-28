import { motion } from "framer-motion";
import { CheckCircle, PoundSterling } from "lucide-react";

export const PaymentButton = ({
  hasPaid,
  pricePerPerson,
  onClick,
  isFirstVisit = false, // We can track this in localStorage
}: {
  hasPaid: boolean;
  pricePerPerson: number;
  onClick: () => void;
  isFirstVisit?: boolean;
}) => {
  if (hasPaid) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-400 rounded-lg">
        <CheckCircle className="w-5 h-5" />
        <span>Paid</span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center gap-2 px-4 py-3 bg-[#FF2E00] hover:bg-[#FF4D00] 
                 text-white font-bold rounded-lg w-full md:w-auto justify-center
                 active:scale-95 transition-all"
      initial={isFirstVisit ? { scale: 1.05 } : {}}
      animate={
        isFirstVisit
          ? {
              scale: [1.05, 1],
              transition: {
                duration: 0.5,
                repeat: 3,
                repeatType: "reverse",
              },
            }
          : {}
      }
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <PoundSterling className="w-5 h-5" />
      <span>Mark as Paid</span>
      <span className="text-sm opacity-80">(£{pricePerPerson.toFixed(2)})</span>

      {isFirstVisit && (
        <motion.div
          className="absolute -inset-1 border-2 border-[#FF2E00] rounded-lg"
          animate={{
            scale: [1, 1.05],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}
    </motion.button>
  );
};
