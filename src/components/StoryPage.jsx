// src/components/StoryPage.jsx
import React from "react";
import { ChevronRight } from "lucide-react";

export default function StoryPage({ situation, previousResponse, onNext }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-10">
          Situation {/* add situation number */}
        </h2>

        {previousResponse && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
            <p className="text-gray-600 italic text-lg">"{previousResponse}"</p>
            <div className="text-sm text-gray-500 mt-2">- Wai's response</div>
          </div>
        )}

        <div className="bg-sky-50 p-6 mb-10 rounded-lg">
          <p className="text-xl text-center">{situation}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-blue-600 transition-all"
          >
            Continue
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
