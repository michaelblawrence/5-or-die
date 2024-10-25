// src/components/AdminUrlModal.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export function AdminUrlModal({
  adminUrl,
  onClose,
}: {
  adminUrl: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(adminUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-[#111] rounded-2xl p-6 space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            🎮 Captain's Controls
          </h2>
          <p className="text-gray-400">
            Save this URL to manage the match later.
          </p>
          <p className="text-gray-400">
            This link gives you admin controls so only share with people you
            trust!
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={adminUrl}
            readOnly
            className="flex-1 px-4 py-3 rounded-lg bg-[#222] border-2 border-[#333] text-white"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#FF2E00] text-white rounded-lg hover:bg-[#FF4D00] transition-colors"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-[#1F2937] text-white rounded-lg hover:bg-[#2D3748] transition-colors"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}
