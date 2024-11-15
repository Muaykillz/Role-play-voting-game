import React, { memo } from "react";
import { Users } from "lucide-react";
import { generateQRCodeURL } from "../lib/utils";

const BackgroundEmojis = memo(() => {
  const emojis = [
    "🗣️",
    "💬",
    "👋",
    "🤝",
    "💼",
    "🎯",
    "⭐️",
    "✨",
    "👮🏻‍♂️",
    "🥰",
    "🧑🏻",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {emojis.map((emoji, i) => (
        <div
          key={i}
          className="absolute text-6xl animate-float"
          style={{
            left: `${i * (100 / emojis.length)}%`,
            top: `${Math.random() * 80 + 10}%`, // 10-90% เพื่อไม่ให้ชิดขอบ
            transform: `rotate(${Math.random() * 20 - 10}deg)`, // -10 ถึง 10 องศา
            opacity: 0.2,
            animationDelay: `${i * 0.2}s`, // ทำให้ emoji ลอยไม่พร้อมกัน
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
});

BackgroundEmojis.displayName = "BackgroundEmojis";

export default function StartPage({ roomCode, playerCount, onStart }) {
  const shareURL = `${window.location.origin}/vote/${roomCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center relative overflow-hidden">
      {/* ใช้ BackgroundEmojis component แทนการเขียน JSX ซ้ำ */}
      <BackgroundEmojis />

      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center relative z-10">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Small Talk Game 🗣️
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Ready to test your communication skills? 🚀
        </p>

        <div className="flex flex-col items-center gap-6 mb-8">
          <img
            src={generateQRCodeURL(shareURL)}
            alt="QR Code"
            className="w-64 h-64 p-2 bg-white rounded-lg shadow-md"
          />
          <div className="text-lg font-mono bg-gray-50 px-4 py-2 rounded-lg">
            Room Code:{" "}
            <span className="font-bold text-blue-600">{roomCode}</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <Users className="text-purple-500" />
            <span>
              Players: <span className="font-bold">{playerCount || 0}</span>
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onStart}
            disabled={!playerCount}
            className={`
              bg-gradient-to-r from-blue-500 to-purple-600 
              text-white px-8 py-4 rounded-full text-lg font-medium
              transition-all duration-300
              flex items-center justify-center gap-2
              ${
                playerCount
                  ? "hover:opacity-90 hover:scale-105 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              }
            `}
          >
            Start Game!
          </button>
        </div>
      </div>
    </div>
  );
}
