/*
 * FillGame.tsx - 填词游戏 + 背诵环节
 * 设计：古风宣纸风格，填词正确后有墨迹晕染动画
 * 流程：填词游戏 → 答对所有 → 进入背诵环节
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

export default function FillGame({ poem, onClose }: FillGameProps) {
  const [phase, setPhase] = useState<GamePhase>('fill');
  const [answers, setAnswers] = useState<AnswerState[]>(
    poem.blanks.map(() => ({ value: '', status: 'idle', revealed: false }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [reciteIndex, setReciteIndex] = useState(0);
  const [revealedLines, setRevealedLines] = useState<Set<number>>(new Set());
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const allCorrect = answers.every(a => a.status === 'correct');
  const totalBlanks = poem.blanks.length;

  const handleInput = (idx: number, value: string) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[idx] = { ...newAnswers[idx], value, status: 'idle' };
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const newAnswers = answers.map((a, i) => ({
      ...a,
      status: a.value.trim() === poem.blanks[i].answer ? 'correct' as const : 'wrong' as const,
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
    setAnswers(poem.blanks.map(() => ({ value: '', status: 'idle', revealed: false })));
    setSubmitted(false);
    setScore(0);
  };

  const handleReveal = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[idx] = { ...newAnswers[idx], value: poem.blanks[idx].answer, status: 'correct', revealed: true };
    setAnswers(newAnswers);
  };

  const handleEnterRecite = () => {
    setPhase('recite');
    setReciteIndex(0);
    setRevealedLines(new Set());
  };

  const toggleRevealLine = (idx: number) => {
    const newSet = new Set(revealedLines);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setRevealedLines(newSet);
  };

  // 渲染诗句（带填空）
  const renderPoemWithBlanks = () => {
    return poem.lines.map((line, lineIdx) => {
      const blanksInLine = poem.blanks
        .map((b, bIdx) => ({ ...b, bIdx }))
        .filter(b => b.lineIndex === lineIdx);

      if (blanksInLine.length === 0) {
        return (
          <div key={lineIdx} className="poem-line text-center text-[#1a1a1a]">
            {line}
          </div>
        );
      }

      // 构建带填空的行
      let chars = line.split('');
      const elements: React.ReactNode[] = [];
      let charIdx = 0;

      while (charIdx < chars.length) {
        const blank = blanksInLine.find(b => b.wordIndex === charIdx);
        if (blank) {
          const ans = answers[blank.bIdx];
          elements.push(
            <span key={`blank-${blank.bIdx}`} className="inline-flex items-center mx-0.5">
              <input
                ref={el => { inputRefs.current[blank.bIdx] = el; }}
                type="text"
                maxLength={1}
                value={ans.value}
                onChange={e => handleInput(blank.bIdx, e.target.value)}
                disabled={submitted && ans.status === 'correct'}
                className="w-8 h-8 text-center text-lg border-b-2 bg-transparent outline-none transition-all"
                style={{
                  fontFamily: 'Noto Serif SC, serif',
                  borderColor: ans.status === 'correct' ? '#2E7D32' : ans.status === 'wrong' ? '#C0392B' : '#8B6914',
                  color: ans.status === 'correct' ? '#2E7D32' : ans.status === 'wrong' ? '#C0392B' : '#1a1a1a',
                  background: ans.status === 'correct' ? 'rgba(46,125,50,0.08)' : ans.status === 'wrong' ? 'rgba(192,57,43,0.08)' : 'transparent',
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSubmit();
                  if (e.key === 'ArrowRight' || e.key === 'Tab') {
                    e.preventDefault();
                    const nextIdx = blank.bIdx + 1;
                    if (nextIdx < poem.blanks.length) inputRefs.current[nextIdx]?.focus();
                  }
                }}
              />
              {submitted && ans.status === 'wrong' && !ans.revealed && (
                <button
                  onClick={() => handleReveal(blank.bIdx)}
                  className="ml-1 text-[#8B6914] hover:text-[#C0392B]"
                  title="查看答案"
                >
                  <Eye className="w-3 h-3" />
                </button>
              )}
            </span>
          );
          charIdx++;
        } else {
          elements.push(
            <span key={`char-${charIdx}`} className="text-[#1a1a1a]">
              {chars[charIdx]}
            </span>
          );
          charIdx++;
        }
      }

      return (
        <div key={lineIdx} className="poem-line text-center flex items-center justify-center flex-wrap">
          {elements}
        </div>
      );
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-60 flex items-center justify-center p-4"
        style={{ background: 'rgba(20,10,5,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #f5edd6 0%, #ede0c4 100%)',
            boxShadow: '0 25px 70px rgba(20,10,5,0.5)',
            border: '1px solid #c9b49a',
          }}
        >
          <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #8B6914, #C0392B, #8B6914)' }} />

          {/* 填词游戏阶段 */}
          {phase === 'fill' && (
            <>
              <div className="px-6 pt-5 pb-4 border-b border-[#c9b49a]/60 flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-[#1a1a1a]" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                    填词挑战
                  </h3>
                  <p className="text-xs text-[#8B6914] mt-0.5" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    《{poem.title}》— {poem.author} · 共{totalBlanks}处填空
                  </p>
                </div>
                <button onClick={onClose} className="text-[#8B6914] hover:text-[#C0392B]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* 提示 */}
                <div className="mb-4 p-3 rounded-sm text-xs text-[#5a4030] bg-[#f0e6c8]/60 border border-[#c9b49a]/60" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                  请在空格处填入正确的字，按 Tab 或 → 切换到下一个空格，按 Enter 提交。
                </div>

                {/* 诗词填空 */}
                <div className="space-y-1 mb-6 p-4 rounded-sm" style={{ background: 'rgba(245,237,214,0.5)', border: '1px solid #c9b49a' }}>
                  {renderPoemWithBlanks()}
                </div>

                {/* 提交后的提示 */}
                {submitted && !allCorrect && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-[#C0392B]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    <XCircle className="w-4 h-4" />
                    答对 {score}/{totalBlanks} 处，点击 <Eye className="w-3 h-3 inline" /> 查看答案，或重新作答
                  </div>
                )}

                {submitted && allCorrect && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4 flex items-center gap-2 text-sm text-[#2E7D32]"
                    style={{ fontFamily: 'Noto Serif SC, serif' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    全部答对！才华横溢，不愧是诗词达人！
                  </motion.div>
                )}
              </div>

              <div className="px-6 pb-5 flex items-center justify-between border-t border-[#c9b49a]/40 pt-4">
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 text-sm text-[#8B6914] hover:text-[#C0392B] transition-colors"
                  style={{ fontFamily: 'Noto Serif SC, serif' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  重新作答
                </button>
                
                {!submitted ? (
                  <button onClick={handleSubmit} className="btn-seal" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                    提交答案
                  </button>
                ) : allCorrect ? (
                  <button onClick={handleEnterRecite} className="btn-seal flex items-center gap-2" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                    进入背诵 <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="btn-seal" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                    重新提交
                  </button>
                )}
              </div>
            </>
          )}

          {/* 成功过渡动画 */}
          {phase === 'success' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(46,125,50,0.1)', border: '2px solid #2E7D32' }}
              >
                <CheckCircle className="w-10 h-10 text-[#2E7D32]" />
              </motion.div>
              <h3 className="text-2xl text-[#1a1a1a] mb-2" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                才华横溢！
              </h3>
              <p className="text-sm text-[#5a4030] mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                全部填词正确，可以进入背诵环节了
              </p>
              <button
                onClick={handleEnterRecite}
                className="btn-seal flex items-center gap-2"
                style={{ fontFamily: 'Ma Shan Zheng, serif', fontSize: '1.1rem' }}
              >
                开始背诵 <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* 背诵环节 */}
          {phase === 'recite' && (
            <>
              <div className="px-6 pt-5 pb-4 border-b border-[#c9b49a]/60 flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-[#1a1a1a]" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                    背诵练习
                  </h3>
                  <p className="text-xs text-[#8B6914] mt-0.5" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    《{poem.title}》— 点击每行查看完整诗句
                  </p>
                </div>
                <button onClick={onClose} className="text-[#8B6914] hover:text-[#C0392B]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
  

                <div className="space-y-3">
                  {poem.lines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="rounded-sm overflow-hidden"
                      style={{ border: '1px solid #c9b49a', background: 'rgba(245,237,214,0.5)' }}
                    >
                      <button
                        onClick={() => toggleRevealLine(idx)}
                        className="w-full flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0"
                            style={{ background: '#8B6914' }}
                          >
                            {idx + 1}
                          </span>
                          <span className="text-sm text-[#8B6914]/60" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                            {revealedLines.has(idx) ? '点击隐藏' : '点击查看'}
                          </span>
                        </div>
                        {revealedLines.has(idx)
                          ? <EyeOff className="w-4 h-4 text-[#8B6914]" />
                          : <Eye className="w-4 h-4 text-[#8B6914]/40" />
                        }
                      </button>
                      
                      <AnimatePresence>
                        {revealedLines.has(idx) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="px-4 pb-3 text-lg text-center text-[#1a1a1a] tracking-widest border-t border-[#c9b49a]/40 pt-2"
                              style={{ fontFamily: 'Noto Serif SC, serif' }}
                            >
                              {line}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>

                {/* 全文展示 */}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      const allRevealed = poem.lines.every((_, i) => revealedLines.has(i));
                      if (allRevealed) {
                        setRevealedLines(new Set());
                      } else {
                        setRevealedLines(new Set(poem.lines.map((_, i) => i)));
                      }
                    }}
                    className="w-full py-2 text-sm text-[#8B6914] border border-[#c9b49a] rounded-sm hover:bg-[#e8d5a3]/40 transition-colors"
                    style={{ fontFamily: 'Noto Serif SC, serif' }}
                  >
                    {poem.lines.every((_, i) => revealedLines.has(i)) ? '隐藏全文' : '展示全文'}
                  </button>
                </div>
              </div>

              <div className="px-6 pb-5 flex items-center justify-between border-t border-[#c9b49a]/40 pt-4">
                <button
                  onClick={() => { setPhase('fill'); handleRetry(); }}
                  className="flex items-center gap-1.5 text-sm text-[#8B6914] hover:text-[#C0392B] transition-colors"
                  style={{ fontFamily: 'Noto Serif SC, serif' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  重新填词
                </button>
                <button onClick={onClose} className="btn-seal" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                  完成学习
                </button>
              </div>
            </>
          )}

          <div className="h-1" style={{ background: 'linear-gradient(90deg, #8B6914, #C0392B, #8B6914)' }} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
