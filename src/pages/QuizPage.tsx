import { useState } from 'react';
import { X, Check } from 'lucide-react';

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
};

export default function QuizPage({ onClose }: { onClose?: () => void }) {
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Which cathedral is Trondheim best known for?',
      options: ['Nidaros Cathedral', 'Cologne Cathedral', 'St. Pauls Cathedral', 'Notre-Dame'],
      correctIndex: 0,
    },
    {
      id: 2,
      question: 'Which fortress overlooks Trondheim and was built in the 17th century?',
      options: ['Kristiansten Fortress', 'Akershus Fortress', 'Fredriksten', 'Bergenhus'],
      correctIndex: 0,
    }
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  const selectOption = (idx: number) => {
    setSelected(idx);
  };

  const handleNext = () => {
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setSelected(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  const score: number = answers.reduce<number>((acc, ans, i) => (ans === questions[i].correctIndex ? acc + 1 : acc), 0);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-sky-50 to-white flex flex-col items-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-serif">Trondheim Quiz</h2>
          <div className="flex items-center gap-2">
            {onClose && (
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {!showResults ? (
            <div>
              <div className="mb-4 text-sm text-gray-600">Question {current + 1} of {questions.length}</div>
              <h3 className="text-xl font-medium mb-4">{questions[current].question}</h3>

              <div className="grid grid-cols-1 gap-3">
                {questions[current].options.map((opt, idx) => {
                  const active = selected === idx;
                  const baseClass = 'text-left p-3 rounded-lg shadow-sm transition-colors border flex items-center justify-between';
                  const style: React.CSSProperties = {
                    backgroundColor: active ? '#FEF3C7' : '#FFFFFF', // amber-100 vs white
                    color: active ? '#92400E' : '#1F2937', // amber-900 vs gray-800
                    borderColor: active ? '#FCD34D' : '#E5E7EB',
                  };

                  return (
                    <button
                      key={idx}
                      onClick={() => selectOption(idx)}
                      role="button"
                      aria-pressed={active}
                      className={baseClass}
                      style={style}
                    >
                      <span>{opt}</span>
                      {active ? <Check className="w-4 h-4 text-amber-700 ml-2" /> : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={selected === null}
                  className={`px-4 py-2 rounded-xl font-medium ${selected === null ? 'bg-gray-200 text-gray-500' : 'bg-amber-600 text-white hover:shadow-lg'}`}
                >
                  {current < questions.length - 1 ? 'Next' : 'Submit'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-3xl font-semibold">{score}/{questions.length}</div>
              </div>
              <div className="mb-4 text-gray-700">You scored {score} out of {questions.length}.</div>

              <div className="space-y-3 text-left">
                {questions.map((q, i) => (
                  <div key={q.id} className="p-3 border rounded-lg">
                    <div className="text-sm font-medium mb-2">{q.question}</div>
                    <div className="text-sm">
                      <div>Correct answer: <span className="font-semibold">{q.options[q.correctIndex]}</span></div>
                      <div>Your answer: <span className="font-semibold">{answers[i] !== null ? q.options[answers[i] as number] : 'No answer'}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => { setShowResults(false); setCurrent(0); setAnswers(Array(questions.length).fill(null)); }} className="px-4 py-2 rounded-xl bg-white border">Retry</button>
                {onClose ? (
                  <button onClick={onClose} className="px-4 py-2 rounded-xl bg-amber-600 text-white">Close</button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
