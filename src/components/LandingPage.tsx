import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronRight,
  Users,
  WholeWord,
  Clock,
  PoundSterling,
} from "lucide-react";

export const LandingPage = ({ onCreateGame }: { onCreateGame: () => void }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);

  const RetroPattern = () => (
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
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-black text-white overflow-hidden"
    >
      {/* Hero Background */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#FF2E00] via-black to-black"
        style={{ y: backgroundY }}
      >
        <RetroPattern />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16"
        style={{ y: textY }}
      >
        <motion.h1
          className="text-8xl md:text-[12rem] font-black text-center leading-none tracking-tighter"
          style={{
            textShadow: `
              2px 2px 0 #FF2E00,
              4px 4px 0 #FF8C00,
              6px 6px 0 #FFD600,
              8px 8px 0 #000
            `,
          }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          5 OR <span className="text-red-700">DIE</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-xl md:text-2xl text-gray-300 text-center max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Stop texting about football. Start playing it.
        </motion.p>

        <motion.button
          onClick={onCreateGame}
          className="mt-12 group relative bg-[#FF2E00] text-white text-xl font-bold py-4 px-8 rounded-lg
                   flex items-center gap-2 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="relative z-10 flex items-center gap-2">
            Organize a Game
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#FFD600] to-[#FF8C00]"
            initial={{ x: "100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </motion.div>

      {/* Features Section */}
      <div className="relative bg-black py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Because 4-a-side is for{" "}
            <span className="text-[#FF2E00]">cowards</span>
          </h2>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-[#FF2E00] to-[#FF8C00] rounded-lg opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300"
                />
                <div
                  className="relative bg-gray-900 p-6 rounded-lg h-full transform group-hover:-translate-x-1 
                              group-hover:-translate-y-1 transition-transform"
                >
                  {feature.icon}
                  <h3 className="text-xl font-bold mt-4 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="relative bg-[#111] py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-2xl md:text-3xl font-medium italic text-gray-300 mb-6">
              "Proper football app this. No fancy nonsense. Just 5-a-side
              sorted."
            </p>
            <p className="text-[#FF2E00] font-bold">- Dave from Hackney</p>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black py-8 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            5 OR DIE © 2024 | For the love of the game
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Football */}
      <motion.div
        className="fixed text-6xl"
        animate={{
          x: ["0vw", "90vw", "0vw"],
          y: ["80vh", "10vh", "80vh"],
          rotate: [0, 360, 720],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ zIndex: 1 }}
      >
        ⚽
      </motion.div>
    </div>
  );
};

const features = [
  {
    icon: <Users className="w-8 h-8 text-[#FF2E00]" />,
    title: "Perfect Teams",
    description:
      "No more uneven sides. We'll sort the teams so there's no excuses.",
  },
  {
    icon: <WholeWord className="w-8 h-8 text-[#FF2E00]" />,
    title: "Share & Play",
    description:
      "One link to rule them all. Share it with the lads and you're sorted.",
  },
  {
    icon: <Clock className="w-8 h-8 text-[#FF2E00]" />,
    title: "No Faffing",
    description:
      "Set up a game in seconds. Less time planning, more time playing.",
  },
  {
    icon: <PoundSterling className="w-8 h-8 text-[#FF2E00]" />,
    title: "Track Payments",
    description:
      "See who's paid and who's trying it on. No more awkward chasing.",
  },
];

export default LandingPage;
