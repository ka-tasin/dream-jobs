"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef, useMemo, useEffect } from "react";
import { Open_Sans } from "next/font/google";

const quicksand = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const GridLine = ({ type, position, cursor, dimensions }) => {
  const strength = 20;
  const distanceFactor = 50;
  const displacement = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const distance =
      type === "horizontal"
        ? Math.abs(cursor.y - position)
        : Math.abs(cursor.x - position);

    const newDisplacement = -(strength / (distance / distanceFactor + 0.7));
    displacement.set(newDisplacement);
  }, [cursor.x, cursor.y, displacement, position, type]);

  if (type === "horizontal") {
    return (
      <motion.div
        className="absolute h-px w-full border-b border-dotted border-red-400/50"
        style={{
          y: displacement,
          top: `${position}px`,
          left: 0,
          opacity: 0.7,
        }}
      />
    );
  }

  return (
    <motion.div
      className="absolute w-px h-full border-r border-dotted border-red-400/50"
      style={{
        x: displacement,
        left: `${position}px`,
        top: 0,
        opacity: 0.7,
      }}
    />
  );
};

const InteractiveBanner = () => {
  const backgroundTexts = [
    { id: 1, text: "Graphic Designer", x: "20%", y: "20%", size: "text-xl" },
    { id: 2, text: "UI/UX Designer", x: "75%", y: "25%", size: "text-xl" },
    { id: 3, text: "Web Development", x: "35%", y: "78%", size: "text-2xl" },
    { id: 4, text: "MERN Stack", x: "80%", y: "70%", size: "text-xl" },
    { id: 8, text: "MERN Stack", x: "85%", y: "50%", size: "text-xl" },
    { id: 5, text: "Backend Developer", x: "60%", y: "15%", size: "text-xl" },
    { id: 6, text: "Node JS Dev", x: "10%", y: "10%", size: "text-xl" },
    { id: 7, text: "Nest JS", x: "14%", y: "60%", size: "text-xl" },
  ];

  const containerRef = useRef(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = (e.clientX - rect.left - centerX) * 0.05;
      const mouseY = (e.clientY - rect.top - centerY) * 0.05;
      x.set(mouseX);
      y.set(mouseY);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredId(null);
    setCursor({ x: dimensions.width / 2, y: dimensions.height / 2 });
  };

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
      setCursor({
        x: containerRef.current.offsetWidth / 2,
        y: containerRef.current.offsetHeight / 2,
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridLines = useMemo(() => {
    const lines = [];
    const spacing = 45;

    // Horizontal lines
    for (let y = spacing; y < dimensions.height; y += spacing) {
      lines.push(
        <GridLine
          key={`h-${y}`}
          type="horizontal"
          position={y}
          cursor={cursor}
          dimensions={dimensions}
        />
      );
    }

    // Vertical lines
    for (let x = spacing; x < dimensions.width; x += spacing) {
      lines.push(
        <GridLine
          key={`v-${x}`}
          type="vertical"
          position={x}
          cursor={cursor}
          dimensions={dimensions}
        />
      );
    }

    return lines;
  }, [dimensions, cursor]);

  return (
    <div className="w-full h-[500px] md:h-[600px] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          scale: {
            type: "spring",
            damping: 10,
            stiffness: 100,
            bounce: 0.9,
          },
        }}
        ref={containerRef}
        className="relative w-full h-full bg-gray-50 flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ overflow: "hidden" }}
      >
        {/* Spacetime Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {gridLines}
        </div>

        {/* Background texts with parallax */}
        {backgroundTexts.map((item) => (
          <motion.div
            key={item.id}
            className={`absolute font-semibold select-none ${item.size}`}
            style={{
              left: item.x,
              top: item.y,
              x: xSpring,
              y: ySpring,
              transform: "translate(-50%, -50%)",
              color: "#2E2E2E",
              zIndex: 1,
            }}
            initial={{ opacity: 0.4 }}
            whileHover={{
              opacity: 1,
              scale: 1.1,
              color: "#ec2e3a",
              transition: { duration: 0.3 },
            }}
            onHoverStart={() => setHoveredId(item.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            {item.text}
          </motion.div>
        ))}

        {/* Foreground content */}
        <div className="relative z-10 text-center p-4">
          <motion.h1
            className={`text-4xl md:text-7xl font-bold text-gray-800 mb-4 ${quicksand.className}`}
          >
            <span className="text-red-700"> Dream </span>bigger, Start today
          </motion.h1>
          <p className="text-lg md:text-2xl text-gray-600 max-w-2xl pt-5 mx-auto">
            Land Your Dream Career with Professional Solutions
          </p>
          <motion.button
            className="mt-8 px-6 py-3 bg-[#0d0d0d] text-white rounded-xl hover:bg-[#2f2c2d] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Connect With Us
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveBanner;
