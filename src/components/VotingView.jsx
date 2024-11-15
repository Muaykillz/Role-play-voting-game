// src/components/VotingView.jsx
import React, { useState, useEffect } from "react";
import { scenarios } from "../lib/gameData";

export default function VotingView({
  currentStep,
  timeLeft,
  voteState,
  roomCode,
  isGameOver,
  onVote,
}) {
  const [hasVoted, setHasVoted] = useState(false);
  const currentScenario = scenarios[currentStep];
  const voteKey = `voted_${roomCode}_${currentStep}`;

  // เพิ่ม voteState เป็น dependency และเช็คเงื่อนไขเพิ่ม
  useEffect(() => {
    // Reset hasVoted เมื่อเปลี่ยน step หรือ เปลี่ยนสถานะเป็น waiting
    if (voteState === "story" || voteState === "waiting") {
      localStorage.removeItem(voteKey);
      setHasVoted(false);
    } else {
      const voted = localStorage.getItem(voteKey);
      setHasVoted(!!voted);
    }
  }, [currentStep, voteKey, voteState]);

  const handleVote = (choiceIndex) => {
    if (!hasVoted && voteState === "voting") {
      onVote(choiceIndex);
      setHasVoted(true);
      localStorage.setItem(voteKey, "true");
    }
  };

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-xl mb-2">Vote submitted! 🎯</div>
          <div className="text-gray-500">Wait for the next question...</div>
        </div>
      </div>
    );
  }

  if (currentStep === scenarios.length - 1 && voteState === "showing_result") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-3 text-yellow-600">
            Game Complete!
          </h2>
          <p className="text-gray-600 mb-2">
            Thanks for helping P navigate through the workplace! 🎉
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Cast Your Vote! 🎯</h2>
          </div>

          {voteState === "voting" && !hasVoted ? (
            <div className="space-y-4">
              {currentScenario.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleVote(index)}
                  disabled={hasVoted}
                  className={`w-full p-6 text-left rounded-xl transition-all transform hover:scale-[1.02] ${
                    hasVoted
                      ? "bg-gray-100 border-2 border-gray-200 cursor-not-allowed"
                      : "bg-white border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  <span className="text-lg">{choice}</span>
                </button>
              ))}
            </div>
          ) : voteState === "waiting" ? (
            <div className="text-center text-gray-500 p-6">
              Waiting for the host to start... ⏳
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6">
              Vote submitted! Wait for next question... ✨
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-500 z-10">
        <p className="text-sm">
          Created with 💖 by{" "}
          <a
            href="https://github.com/Muaykillz"
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
