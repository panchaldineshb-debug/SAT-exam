import React, { useState, useEffect } from 'react';

export default function DailyChallenge() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Fetch the daily questions JSON
    fetch('/data/daily_questions.json')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          // Pick one question based on the day of the year so it changes daily
          const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
          const dailyQ = data[dayOfYear % data.length];
          setQuestion(dailyQ);
        }
      })
      .catch(err => console.error("Failed to fetch daily question", err));
  }, []);

  if (!question) {
    return null; // Don't render anything if loading or failed
  }

  const handleSelect = (option) => {
    if (showResult) return;
    setSelectedOption(option);
    setShowResult(true);
  };

  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="daily-challenge-card bg-zinc-800 p-6 rounded-lg border border-zinc-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔥</span>
        <h3 className="text-xl font-bold text-white">Problem of the Day</h3>
      </div>
      
      <div className="mb-2">
        <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded">
          {question.subject.toUpperCase()} • {question.topic}
        </span>
      </div>
      
      <p className="text-white mb-4 mt-3">{question.text}</p>
      
      <div className="space-y-2">
        {question.options.map((opt, idx) => {
          let btnClass = "w-full text-left p-3 rounded border transition-colors ";
          
          if (!showResult) {
            btnClass += "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-700 hover:text-white";
          } else {
            if (opt === question.correctAnswer) {
              btnClass += "bg-emerald-900/50 border-emerald-500 text-white";
            } else if (opt === selectedOption) {
              btnClass += "bg-red-900/50 border-red-500 text-white";
            } else {
              btnClass += "border-zinc-700 bg-zinc-900 text-zinc-500 opacity-50";
            }
          }
          
          return (
            <button
              key={idx}
              onClick={() => handleSelect(opt)}
              className={btnClass}
              disabled={showResult}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-4 p-4 rounded ${isCorrect ? 'bg-emerald-900/20' : 'bg-zinc-900/50'}`}>
          <p className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'} mb-2`}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </p>
          <p className="text-sm text-zinc-300">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
