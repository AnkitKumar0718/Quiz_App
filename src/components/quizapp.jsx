import React, { useEffect, useState, useCallback } from 'react'
import { quiz } from './quiz';

// timer, status color of total marks and text display , 

export const Quizapp = () => {
    const optionLabels = ["a)", "b)", "c)", "d)"]
    const [isAnswered, setIsAnswered] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(false);
    const TOTAL_TIME = 5 * 60; // 5 minutes in seconds
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

    const handleAnswer = (qIndex, ansIndex) => {
        if (isSubmitted) return;
        setIsAnswered((prev) => (
            { ...prev, [qIndex]: ansIndex }
        ))
    }

    const handleSubmit = useCallback(() => {
        let tempScore = 0;
        quiz.forEach((q, i) => {
            if (isAnswered[i] === q.answer)
                tempScore++
        })
        setScore(tempScore);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // alert("Quiz Completed Successfully") // Removed alert for better UX
    }, [isAnswered]);

    useEffect(() => {
        if (isSubmitted) return;

        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted, handleSubmit]);

    useEffect(() => {
        if (isSubmitted && score === quiz.length) {
            import('canvas-confetti').then((confetti) => {
                confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            });
        }
    }, [isSubmitted, score]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };


    return (
        <div className='flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-10 px-4'>

            {/* Header / Title */}
            <div className='mb-8 text-center'>
                <h1 className='text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2'>
                    Super Quiz Challenge By Ankit
                </h1>
                <p className='text-gray-500 text-lg'>Test your knowledge!</p>
            </div>

            {/* Timer Badge - Fixed or Sticky */}
            {!isSubmitted && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full shadow-lg font-bold text-lg border-2 transition-all duration-300
                        ${timeLeft <= 30 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-white border-indigo-100 text-indigo-600"}
                    `}>
                    ⏱ {formatTime(timeLeft)}
                </div>
            )}

            {/* Main Quiz Container */}
            <div className='w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>

                {/* Score / Result Section (Top of card if submitted) */}
                {isSubmitted && (
                    <div className={`p-8 text-center ${score > 3 ? "bg-green-50" : "bg-indigo-50"}`}>
                        <h2 className='text-3xl font-bold mb-2 text-gray-800'>Quiz Completed!</h2>
                        <div className='flex justify-center items-center gap-4 mt-4'>
                            <div className='flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[120px]'>
                                <span className='text-sm text-gray-500 uppercase tracking-wider font-semibold'>Score</span>
                                <span className={`text-4xl font-black ${score > 3 ? "text-green-600" : "text-indigo-600"}`}>
                                    {score} <span className="text-xl text-gray-400">/ {quiz.length}</span>
                                </span>
                            </div>
                            <div className='flex flex-col bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-w-[120px]'>
                                <span className='text-sm text-gray-500 uppercase tracking-wider font-semibold'>Status</span>
                                <span className={`text-xl font-bold ${score > 15 ? "text-green-600" : "text-orange-500"}`}>
                                    {score > 15 ? "Excellent!" : score === 0 ? "Don't worry Try again" : "Good Effort Try Again"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className='p-6 md:p-8 space-y-8'>
                    {quiz.map((q, i) => (
                        <div key={q.id} className='flex flex-col space-y-4'>
                            {/* Question Header */}
                            <div className='flex items-start gap-4'>
                                <span className='flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg'>
                                    {i + 1}
                                </span>
                                <h3 className='text-xl font-semibold text-gray-800 leading-snug pt-1'>
                                    {q.question}
                                </h3>
                            </div>

                            {/* Options Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pl-14'>
                                {q.options.map((o, index) => {
                                    const isSelected = isAnswered[i] === index;
                                    const isCorrect = index === q.answer;

                                    // Determine styling based on state
                                    let buttonStyle = "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 bg-white text-gray-700";
                                    let icon = null;

                                    if (isSubmitted) {
                                        if (isCorrect) {
                                            buttonStyle = "bg-green-100 border-green-400 text-green-700 ring-1 ring-green-400"; // Correct answer
                                            icon = <span className="text-green-600">✔</span>;
                                        } else if (isSelected) { // Wrong answer selected
                                            buttonStyle = "bg-red-50 border-red-300 text-red-700 ring-1 ring-red-300";
                                            icon = (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                                                    <path d="M18 6 6 18" />
                                                    <path d="m6 6 12 12" />
                                                </svg>
                                            );
                                        } else {
                                            buttonStyle = "bg-gray-50 border-gray-100 text-gray-400 opacity-60"; // Other non-selected options
                                        }
                                    } else {
                                        if (isSelected) {
                                            buttonStyle = "bg-indigo-600 border-indigo-600 text-white shadow-md transform scale-[1.02]";
                                        }
                                    }

                                    return (
                                        <button
                                            key={index}
                                            disabled={isSubmitted}
                                            onClick={() => handleAnswer(i, index)}
                                            className={`relative flex items-center p-3 text-left border rounded-xl transition-all duration-200 group ${buttonStyle}`}
                                        >
                                            <span className={`flex justify-center items-center w-6 h-6 rounded-full border mr-3 text-xs font-bold shrink-0
                                                    ${isSubmitted || isSelected
                                                    ? 'border-transparent bg-white/20'
                                                    : 'border-gray-300 text-gray-400 group-hover:border-indigo-400 group-hover:text-indigo-500'}
                                                `}>
                                                {optionLabels[index].replace(')', '')}
                                            </span>
                                            <span className="font-medium flex-1">{o}</span>
                                            {icon && <span className="ml-2">{icon}</span>}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Not Answered Warning */}
                            {isSubmitted && isAnswered[i] === undefined && (
                                <p className="pl-14 text-sm text-red-500 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    Not answered
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Submit Action */}
                {!isSubmitted && (
                    <div className='p-6 bg-gray-50 border-t border-gray-100 flex justify-center sticky bottom-0 z-10'>
                        <button
                            onClick={handleSubmit}
                            className='px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2'
                        >
                            Submit Quiz 🚀
                        </button>
                    </div>
                )}
            </div>

            {(isSubmitted && score === quiz.length) && (
                <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                </div>
            )}

        </div>
    )
}
