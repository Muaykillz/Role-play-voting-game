import React, { useEffect, useRef, useState } from "react";
import { Timer, Users, Volume2, VolumeX } from "lucide-react";
import { scenarios } from "../lib/gameData";
import { cn, formatTime, calculatePercentage } from "../lib/utils";

export default function DisplayView({
  votes,
  currentStep,
  timeLeft,
  voteState,
  roomCode,
  players,
  children, // สำหรับ render ResultDialog
}) {
  const currentScenario = scenarios[currentStep];
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const audioRef = useRef(new Audio("/BG_song.mp3"));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.2;

    // เริ่มเล่นเพลงทันทีที่เข้าสู่ DisplayView
    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.log("Error playing audio:", err);
      }
    };

    playAudio();

    // Cleanup เมื่อออกจาก DisplayView
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 relative">
        {/* Header with Timer and Player Count */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center text-2xl bg-blue-50 px-6 py-3 rounded-full">
            <Timer className="mr-2 text-blue-500" />
            <span className="font-bold">{formatTime(timeLeft)}</span>
          </div>

          <div className="flex items-center text-2xl bg-purple-50 px-6 py-3 rounded-full">
            <Users className="mr-2 text-purple-500" />
            <span className="font-bold">{players}</span>
          </div>
        </div>

        {/* Scenario Display */}
        <div className="mb-8 bg-gray-50 p-6 rounded-xl border-2 border-gray-100">
          <div className="text-3xl font-bold mb-4">
            Situation {currentStep + 1}
          </div>
          <p className="text-2xl mb-4">{currentScenario.situation}</p>
          <p className="text-2xl font-semibold text-blue-600">
            {currentScenario.question}
          </p>
        </div>

        {/* Choices with Live Voting Results */}
        <div className="space-y-6">
          {currentScenario.choices.map((choice, index) => (
            <div
              key={index}
              className={cn(
                "transform transition-all hover:scale-[1.01]",
                voteState === "showing_result" && {
                  "ring-4": true,
                  "ring-green-500": index === currentScenario.correctChoice,
                  "ring-red-500": index !== currentScenario.correctChoice,
                }
              )}
            >
              <div className="p-6 rounded-xl border-2 border-gray-200 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-xl">{choice}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{votes[index]}</span>
                    <span className="text-gray-500">
                      ({calculatePercentage(votes[index], totalVotes)}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      voteState === "showing_result"
                        ? index === currentScenario.correctChoice
                          ? "bg-green-500"
                          : "bg-red-500"
                        : "bg-blue-500"
                    )}
                    style={{
                      width: `${calculatePercentage(
                        votes[index],
                        totalVotes
                      )}%`,
                      transition: "width 0.5s ease-out",
                    }}
                  />
                </div>

                {/* Tie Breaker Indicator */}
                {voteState === "showing_result" &&
                  votes[0] === votes[1] &&
                  index === currentScenario.correctChoice && (
                    <div className="mt-2 text-sm text-gray-500 italic">
                      Tie breaker: P chose the safe approach! 🎯
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Render ResultDialog or other modals */}
        {children}
      </div>
    </div>
  );
}
