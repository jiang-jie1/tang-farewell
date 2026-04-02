/*
 * FillGame.tsx - 填词游戏 + 背诵环节（随机挖空版本）
 * 设计：古风宣纸风格，填词正确后有墨迹晕染动画
 * 流程：随机挖空 → 填词游戏 → 答对所有 → 进入背诵环节
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, RotateCcw, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { type Poem } from '@/data/poems';

interface FillGameProps {
  poem: Poem;
  onClose: () => void;
}

type GamePhase = 'fill' | 'success' | 'recite';

interface AnswerState {
  value: string;
  status: 'idle' | 'correct' | 'wrong';
  revealed: boolean;
}

interface RandomBlank {
  lineIndex: number;
  wordIndex: number;
  answer: string;
  hint: string;
}

// 生成随机挖空位置
function generateRandomBlanks(poem: Poem, count: number = 5): RandomBlank[] {
  const blanks: RandomBlank[] = [];
  const used = new Set<string>();

  // 收集所有可能的挖空位置（每行最多挖空1-2个字）
  const candidates: RandomBlank[] = [];
  poem.lines.forEach((line, lineIndex) => {
    for (let wordIndex = 0; wordIndex < line.length; wordIndex++) {
      const char = line[wordIndex];
      // 跳过标点符号和空格
      if (!/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ffa-zA-Z0-9]/.test(char)) continue;
      
      candidates.push({
        lineIndex,
        wordIndex,
        answer: char,
        hint: `第${lineIndex + 1}句第${wordIndex + 1}字`,
      });
    }
  });

  // 随机选择指定数量的挖空位置
  const targetCount = Math.min(count, candidates.length);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  
  for (const blank of shuffled) {
    if (blanks.length >= targetCount) break;
    const key = `${blank.lineIndex}-${blank.wordIndex}`;
    if (!used.has(key)) {
      blanks.push(blank);
      used.add(key);
    }
  }

  return blanks.sort((a, b) => 
    a.lineIndex !== b.lineIndex ? a.lineIndex - b.lineIndex : a.wordIndex - b.wordIndex
  );
}

export default function FillGame({ poem, onClose }: FillGameProps) {
  const [randomBlanks] = useState<RandomBlank[]>(() => generateRandomBlanks(poem, 5));
  const [phase, setPhase] = useState<GamePhase>('fill');
  const [answers, setAnswers] = useState<AnswerState[]>(
    randomBlanks.map(() => ({ value: '', status: 'idle', revealed: false }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const allCorrect = answers.every(a => a.status === 'correct');
  const totalBlanks = randomBlanks.length;

  const handleInput = (idx: number, value: string) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[idx] = { ...newAnswers[idx], value, status: 'idle' };
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newAnswers = answers.map((a, i) => ({
      ...a,
      status: a.value.trim() === randomBlanks[i].answer ? 'correct' as const : 'wrong' as const,
    }));
    setAnswers(newAnswers);
    setSubmitted(true);
    const correctCount = newAnswers.filter(a => a.status === 'correct').length;
    setScore(correctCount);

    if (newAnswers.every(a => a.status === 'correct')) {
      setTimeout(() => setPhase('success'), 800);
    }
  };

  const handleRetry = () => {
    setAnswers(randomBlanks.map(() => ({ value: '', status: 'idle', revealed: false })));
    setSubmitted(false);
    setScore(0);
  };

  const handleReveal = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[idx] = { ...newAnswers[idx], value: randomBlanks[idx].answer, status: 'correct', revealed: true };
    setAnswers(newAnswers);
  };

  const handleEnterRecite = () => {
    setPhase('recite');
    setReciteIndex(0);
    setRevealedLines(new Set());
  };

  const toggleRevealLine = (idx: number) => {
    const newSet = new Set(revealedLines);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setRevealedLines(newSet);
  };

  // 构建显示文本（带挖空）
  const displayLines = poem.lines.map((line, lineIndex) => {
    let result = '';
    for (let wordIndex = 0; wordIndex < line.length; wordIndex++) {
      const blank = randomBlanks.find(b => b.lineIndex === lineIndex && b.wordIndex === wordIndex);
      if (blank) {
        const answerIdx = randomBlanks.indexOf(blank);
        const answer = answers[answerIdx];
        if (submitted && answer.status === 'correct') {
          result += answer.value || '_';
        } else if (answer.revealed) {
          result += answer.value || '_';
        } else {
          result += '___';
        }
      } else {
        result += line[wordIndex];
      }
    }
    return result;
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-b from-[#fffbf0] to-[#f5ede6] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#d4c5b0]"
      >
        {/* 标题栏 */}
        <div className="sticky top-0 bg-gradient-to-r from-[#f5ede6] to-[#fffbf0] border-b-2 border-[#d4c5b0] p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#5a4030]">{poem.title}</h2>
            <p className="text-sm text-[#8b7355]">{poem.author}·{poem.dynasty}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#e8dcc8] rounded-lg transition-colors"
          >
            <X size={24} className="text-[#8b7355]" />
          </button>
        </div>

        {/* 游戏内容 */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {phase === 'fill' && (
              <motion.div
                key="fill"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* 诗文显示（带挖空） */}
                <div className="mb-6 p-4 bg-white/50 rounded-lg border border-[#d4c5b0]">
                  <div className="space-y-3 font-serif text-lg text-[#5a4030] leading-relaxed">
                    {displayLines.map((line, idx) => (
                      <div key={idx} className="text-center">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 填空输入框 */}
                <div className="mb-6 space-y-3">
                  <h3 className="text-sm font-semibold text-[#8b7355]">请填写挖空的字词：</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {randomBlanks.map((blank, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <label className="text-xs text-[#8b7355] min-w-fit">
                          第{blank.lineIndex + 1}句：
                        </label>
                        <div className="relative flex-1">
                          <input
                            ref={(el) => { if (el) inputRefs.current[idx] = el; }}
                            type="text"
                            value={answers[idx].value}
                            onChange={e => handleInput(idx, e.target.value)}
                            disabled={submitted}
                            maxLength={4}
                            placeholder="?"
                            className={`w-full px-2 py-1 text-center rounded border-2 transition-colors ${
                              answers[idx].status === 'correct'
                                ? 'border-green-500 bg-green-50'
                                : answers[idx].status === 'wrong'
                                ? 'border-red-500 bg-red-50'
                                : 'border-[#d4c5b0] bg-white'
                            }`}
                          />
                          {answers[idx].status === 'correct' && (
                            <CheckCircle size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500" />
                          )}
                          {answers[idx].status === 'wrong' && (
                            <XCircle size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" />
                          )}
                        </div>
                        {submitted && (
                          <button
                            onClick={() => handleReveal(idx)}
                            className="p-1 hover:bg-[#e8dcc8] rounded transition-colors"
                            title="显示答案"
                          >
                            {answers[idx].revealed ? (
                              <Eye size={16} className="text-[#8b7355]" />
                            ) : (
                              <EyeOff size={16} className="text-[#8b7355]" />
                            )}
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 提交按钮 */}
                <div className="flex gap-3">
                  {!submitted ? (
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-[#8b4513] to-[#a0522d] hover:from-[#704010] hover:to-[#8b3a1f] text-white py-2 rounded-lg font-semibold transition-all"
                    >
                      提交答案
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleRetry}
                        className="flex-1 bg-[#d4c5b0] hover:bg-[#c4b5a0] text-[#5a4030] py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} />
                        重新填写
                      </button>
                      {allCorrect && (
                        <button
                          onClick={handleEnterRecite}
                          className="flex-1 bg-gradient-to-r from-[#8b4513] to-[#a0522d] hover:from-[#704010] hover:to-[#8b3a1f] text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          进入背诵
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {submitted && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-[#8b7355]">
                      得分：<span className="font-bold text-lg text-[#5a4030]">{score}/{totalBlanks}</span>
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {phase === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold text-[#5a4030] mb-2">完美！</h3>
                <p className="text-[#8b7355] mb-6">所有空白都填写正确</p>
                <button
                  onClick={handleEnterRecite}
                  className="bg-gradient-to-r from-[#8b4513] to-[#a0522d] hover:from-[#704010] hover:to-[#8b3a1f] text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  进入背诵环节
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}

            {phase === 'recite' && (
              <motion.div
                key="recite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-lg font-semibold text-[#5a4030] mb-4">背诵环节</h3>
                <div className="space-y-3">
                  {poem.lines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 bg-white/50 rounded-lg border border-[#d4c5b0] cursor-pointer hover:bg-white/70 transition-colors"
                      onClick={() => toggleRevealLine(idx)}
                    >
                      <div className="text-center font-serif text-lg text-[#5a4030]">
                        {revealedLines.has(idx) ? (
                          line
                        ) : (
                          <span className="text-[#c4b5a0]">点击显示第{idx + 1}句</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {poem.reciteHint && poem.reciteHint.length > 0 && (
                  <div className="mt-6 p-4 bg-[#f5ede6] rounded-lg border border-[#d4c5b0]">
                    <h4 className="text-sm font-semibold text-[#8b7355] mb-2">背诵提示（每句首字）：</h4>
                    <p className="text-[#5a4030] font-serif text-lg tracking-widest">
                      {poem.reciteHint.join(' ')}
                    </p>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full mt-6 bg-[#d4c5b0] hover:bg-[#c4b5a0] text-[#5a4030] py-2 rounded-lg font-semibold transition-all"
                >
                  完成
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
