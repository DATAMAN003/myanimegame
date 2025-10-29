import { useState, useEffect } from 'react';
import { Challenge } from '../../../shared/types/api';

interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
  correctAnswer: number;
}

interface TriviaChallengeProps {
  challenge: Challenge;
  onScore: (score: number) => void;
  gameState: string;
}

export const TriviaChallenge = ({ challenge, onScore, gameState }: TriviaChallengeProps) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30000); // 30 seconds
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameState === 'playing') {
      // Fetch trivia questions
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`/api/trivia-questions?difficulty=${challenge.difficulty}&count=5`);
          const data = await response.json();
          setQuestions(data.questions);
          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch trivia questions:', error);
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [challenge.difficulty, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || loading) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onScore(score);
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameState, onScore, score, loading]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showResult || gameState !== 'playing') return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      const newScore = score + 25;
      setScore(newScore);
    }

    // Move to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // All questions completed
        onScore(score + (isCorrect ? 25 : 0));
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">🧠 Loading anime knowledge test...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">No questions available</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">No question available</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* HUD */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-black/70 px-4 py-2 rounded-lg border border-yellow-400/50">
          <span className="text-yellow-400 font-bold text-xl">🧠 Score: {score}</span>
        </div>
        <div className="bg-black/70 px-4 py-2 rounded-lg border border-purple-400/50">
          <span className="text-purple-400 font-bold text-xl">
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="bg-black/70 px-4 py-2 rounded-lg border border-red-400/50">
          <span className="text-red-400 font-bold text-xl">
            ⏱️ {Math.ceil(timeLeft / 1000)}s
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-8 mb-6 border-2 border-white/20">
        {/* Category */}
        <div className="text-center mb-4">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
            📚 {currentQuestion.category}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQuestion.options.map((option, index) => {
            let buttonClass = 'bg-gradient-to-br from-blue-600/80 to-purple-600/80 hover:from-blue-500/80 hover:to-purple-500/80 text-white border-blue-400/50';
            
            if (showResult && selectedAnswer !== null) {
              if (index === selectedAnswer) {
                buttonClass = index === currentQuestion.correctAnswer
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-400' 
                  : 'bg-gradient-to-br from-red-500 to-red-600 text-white border-red-400';
              } else if (index === currentQuestion.correctAnswer && selectedAnswer !== currentQuestion.correctAnswer) {
                // Show correct answer
                buttonClass = 'bg-gradient-to-br from-green-500/70 to-green-600/70 text-white border-green-400';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null || gameState !== 'playing'}
                className={`p-4 md:p-6 rounded-xl border-2 font-medium text-left transition-all duration-300 transform hover:scale-105 active:scale-95 ${buttonClass} ${
                  selectedAnswer !== null || gameState !== 'playing' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
                }`}
              >
                <span className="font-bold mr-3 text-lg">{String.fromCharCode(65 + index)}.</span>
                <span className="text-base md:text-lg">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Result Feedback */}
        {showResult && selectedAnswer !== null && (
          <div className="text-center mt-6">
            <div className={`text-3xl font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
              {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct! +25 points' : '✗ Wrong answer'}
            </div>
            {currentQuestionIndex < questions.length - 1 && (
              <p className="text-gray-300 mt-2">Next question coming up...</p>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center">
        <p className="text-white/60 text-sm">
          🧠 Test your anime knowledge! Each correct answer = +25 points
        </p>
      </div>

      {/* Game Over State */}
      {gameState === 'completed' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <h3 className="text-5xl font-bold text-white mb-4">🧠 KNOWLEDGE TEST COMPLETE! 🧠</h3>
            <p className="text-3xl text-yellow-400 mb-2">Final Score: {score}</p>
            <p className="text-xl text-gray-300">
              Correct Answers: {score / 25} / {questions.length}
            </p>
            <p className="text-xl text-gray-300">
              Accuracy: {Math.round((score / 25) / questions.length * 100)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
