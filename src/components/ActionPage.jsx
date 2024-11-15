// src/components/ActionPage.jsx

import { useEffect } from "react";
import React from "react";
import { ChevronRight } from "lucide-react";

export default function ActionPage({ isSuccess, message, failReason, onNext }) {
  useEffect(() => {
    if (!isSuccess) {
      const gameOverAudio = new Audio("/game_over.mp3");
      gameOverAudio.play().catch((error) => {
        console.log("Error playing audio:", error);
      });
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {isSuccess ? (
          <>
            <div className="text-5xl mb-6">🌟</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Great Job!
            </h2>
            <p className="text-xl text-gray-600 mb-8">{message}</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-6">💼</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              P is Fired! 😭
            </h2>
            <p className="text-xl text-gray-600 mb-4">{message}</p>
            {failReason && (
              <p className="text-gray-500 italic mb-8">"{failReason}"</p>
            )}
          </>
        )}

        <button
          onClick={onNext}
          className={`${
            isSuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto transition-all`}
        >
          {isSuccess ? "Continue" : "Try Again"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
