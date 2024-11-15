// src/components/CongratulationPage.jsx

import { memo } from "react";

const BackgroundEmojis = memo(() => {
  const emojis = [
    "🏆",
    "🎉",
    "🙌🏻",
    "🤝",
    "🍾",
    "🥳",
    "🏆",
    "🎉",
    "🏆",
    "🔥",
    "🐶",
    "👏🏻",
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

export default function CongratulationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex flex-col justify-between p-4 relative overflow-hidden">
      <BackgroundEmojis />

      {/* Main Content - เพิ่ม margin-top และ margin-bottom */}
      <div className="flex-grow flex items-center justify-center my-8">
        <div className="max-w-3xl bg-white rounded-2xl shadow-xl px-12 text-center py-16 relative z-10">
          <div className="text-6xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            Mission Completed!
          </h1>
          <div className="w-full flex flex-col items-center justify-center min-h-[60px] mb-8 rounded-lg bg-amber-50 p-6">
            <p className="text-xl font-semibold text-gray-700 text-center leading-relaxed">
              Congratulations! You've helped P survive his first day at work! 🎉
            </p>
          </div>
          <div className="space-y-4 text-lg text-gray-600 flex justify-center items-center">
            <p className="text-base max-w-[520px] ">
              P successfully navigated through all workplace conversations with
              professionalism and respect.
              <span className="inline-block animate-pulse ml-1">🌟</span>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-500 z-10">
        <p className="text-sm">
          Created with 💖 by{" "}
          <a
            href="https://github.com/Muaykillz" // สมมติ link ถ้ามี
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Mudev
          </a>
        </p>
      </footer>
    </div>
  );
}
