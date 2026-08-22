import React, { useMemo } from 'react';

export default function MistakeJournal({ completedTests, tests }) {
  const mistakes = useMemo(() => {
    if (!completedTests || !tests) return [];
    
    let allMistakes = [];

    // Loop through each completed test
    Object.values(completedTests).forEach(completedTest => {
      const originalTest = tests.find(t => t.id === completedTest.testId);
      if (!originalTest) return;

      const userAnswers = completedTest.userAnswers || {};
      
      // Check each question
      originalTest.questions.forEach(q => {
        const studentAnswer = userAnswers[q.id];
        if (studentAnswer && studentAnswer !== q.correctAnswer) {
          allMistakes.push({
            testName: originalTest.title,
            date: new Date(completedTest.date).toLocaleDateString(),
            question: q,
            studentAnswer: studentAnswer
          });
        }
      });
    });

    return allMistakes;
  }, [completedTests, tests]);

  if (mistakes.length === 0) {
    return (
      <div className="bg-zinc-800 p-8 rounded-lg border border-zinc-700 text-center mt-6">
        <h3 className="text-xl font-bold text-white mb-2">Mistake Journal</h3>
        <p className="text-zinc-400">You haven't made any mistakes yet, or haven't taken any tests!</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Mistake Journal</h2>
      <p className="text-zinc-400 mb-6">Reviewing your mistakes is the best way to improve. Here is a log of all questions you answered incorrectly.</p>
      
      {mistakes.map((mistake, idx) => (
        <div key={idx} className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
          <div className="flex justify-between items-start mb-4 border-b border-zinc-700 pb-2">
            <span className="text-sm text-zinc-400">{mistake.testName} • {mistake.date}</span>
            <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">
              {mistake.question.subject} - {mistake.question.topic || 'General'}
            </span>
          </div>
          
          <div className="text-white mb-4 whitespace-pre-wrap font-medium">
            {mistake.question.text}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 p-4 rounded border border-red-900/50">
              <span className="text-xs text-red-400 uppercase tracking-wider font-bold mb-1 block">Your Answer</span>
              <div className="text-white">{mistake.studentAnswer}</div>
            </div>
            <div className="bg-zinc-900 p-4 rounded border border-emerald-900/50">
              <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold mb-1 block">Correct Answer</span>
              <div className="text-white">{mistake.question.correctAnswer}</div>
            </div>
          </div>
          
          {mistake.question.explanation && (
            <div className="mt-4 text-sm text-zinc-300 bg-zinc-900/50 p-4 rounded">
              <span className="font-bold text-zinc-100">Explanation:</span> {mistake.question.explanation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
