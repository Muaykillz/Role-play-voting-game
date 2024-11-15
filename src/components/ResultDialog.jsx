// src/components/ResultDialog.jsx

import React from "react";
import { ChevronRight } from "lucide-react";

export default function ResultDialog({ selectedChoice, isTieBreaker, onNext }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-8">
        <div className="text-center">
          <div className="text-4xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold mb-4">Scene in Action!</h2>

          {isTieBreaker && (
            <p className="text-gray-500 mb-4 italic">
              "Votes were tied! P decides to choose the safe approach..."
            </p>
          )}

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-lg">P: "{selectedChoice}"</p>
          </div>

          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center gap-2 mx-auto hover:bg-blue-600 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
