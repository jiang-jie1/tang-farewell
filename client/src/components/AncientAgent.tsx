/*
 * AncientAgent.tsx - 古风智能体对话组件
 * 设计：古风UI，支持文字输入和语音交互（语音通过Web Speech API）
 * API：调用火山引擎 Doubao 模型（通过后端代理）
 * 注意：此为前端组件，API调用通过后端 /api/chat 路由
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, MessageSquare, Volume2, VolumeX, Bot } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AncientAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SYSTEM_PROMPT = `你是一位精通唐代诗词的古代文人学者，名为"诗仙引路人"。你博学多才，尤其擅长唐代送别诗的赏析与讲解。

你的职责是：
1. 帮助学生理解唐代送别诗的意境、典故和历史背景
2. 解答关于诗词的各种问题，包括字词释义、修辞手法、诗人生平等
3. 引导学生深入理解"送别"这一主题在唐代诗歌中的文化内涵
4. 用生动有趣的方式讲解诗词知识，适合中学生学习

你的语言风格：
- 温文尔雅，偶尔引用古诗词
- 讲解深入浅出，举例生动
- 对学生的问题耐心解答
- 可以适当使用"老夫""在下"等古风称谓，但不要过度文言化，保持易懂

重点诗词：《送杜少府之任蜀州》（王勃）、《送元二使安西》（王维）、《黄鹤楼送孟浩然之广陵》（李白）、《凉州词》（王之涣）、《从军行》（王昌龄）、《芙蓉楼送辛渐》（王昌龄）等唐代送别诗。`;

export default function AncientAgent({ isOpen, onClose }: AncientAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '在下乃诗仙引路人，专为有志于诗词之道的学子答疑解惑。\n\n此处汇聚了唐代最经典的送别诗，从长安出发，或赴蜀地，或下扬州，或戍边塞……每一首诗背后，都有一段令人动容的离别故事。\n\n你有何疑问，尽管道来。',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const chatMutation = trpc.agent.chat.useMutation();

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: content.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 构建对话历史（不包含初始欢迎消息）
      const history = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && messages.indexOf(m) > 0))
        .slice(-8)
        .map(m => ({ role: m.role, content: m.content }));

      const result = await chatMutation.mutateAsync({
        message: content.trim(),
        history,
      });

      const rawReply = result.reply;
      const reply = typeof rawReply === 'string' ? rawReply : '抱歉，老夫一时语塞，请稍后再问。';
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      // 可选：语音朗读回复
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '老夫与外界通讯暂时受阻，请稍候片刻再试。若问题持续，请检查网络连接。',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('您的浏览器不支持语音识别功能，请使用文字输入。');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const quickQuestions = [
    '《送杜少府之任蜀州》的主旨是什么？',
    '为什么唐人送别要折柳？',
    '王维和李白的送别诗有何不同？',
    '边塞送别诗有什么特点？',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 w-96 max-h-[600px] flex flex-col z-40 rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #f5edd6 0%, #ede0c4 100%)',
            boxShadow: '0 20px 60px rgba(20,10,5,0.35), 0 0 0 1px rgba(201,180,154,0.5)',
            border: '1px solid #c9b49a',
          }}
        >
          {/* 顶部装饰 */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #C0392B, #8B6914, #C0392B)' }} />

          {/* 头部 */}
          <div className="px-4 py-3 border-b border-[#c9b49a]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#c9b49a]">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663491654141/LTA32sutDCREcmjm8CePHN/agent-avatar-ZJjam5uQ4DnvgPJJG4VNA7.webp"
                  alt="诗仙引路人"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-base text-[#1a1a1a]" style={{ fontFamily: 'Ma Shan Zheng, serif' }}>
                  诗仙引路人
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse" />
                  <span className="text-xs text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    唐诗智能助手
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* 语音朗读开关 */}
              <button
                onClick={() => setIsSpeaking(!isSpeaking)}
                className={`p-1.5 rounded-sm transition-colors ${isSpeaking ? 'text-[#C0392B]' : 'text-[#8B6914]'} hover:bg-[#e8d5a3]/40`}
                title={isSpeaking ? '关闭语音朗读' : '开启语音朗读'}
              >
                {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button onClick={onClose} className="text-[#8B6914] hover:text-[#C0392B] p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5">
                    <img
                      src="https://d2xsxph8kpxj0f.cloudfront.net/310519663491654141/LTA32sutDCREcmjm8CePHN/agent-avatar-ZJjam5uQ4DnvgPJJG4VNA7.webp"
                      alt="助手"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className="max-w-[80%] px-3 py-2 rounded-sm text-sm leading-6 whitespace-pre-wrap"
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    background: msg.role === 'user'
                      ? 'rgba(192,57,43,0.12)'
                      : 'rgba(245,237,214,0.8)',
                    border: `1px solid ${msg.role === 'user' ? 'rgba(192,57,43,0.3)' : '#c9b49a'}`,
                    color: '#2d1f0f',
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                  <img
                    src="https://d2xsxph8kpxj0f.cloudfront.net/310519663491654141/LTA32sutDCREcmjm8CePHN/agent-avatar-ZJjam5uQ4DnvgPJJG4VNA7.webp"
                    alt="助手"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="px-3 py-2 rounded-sm"
                  style={{ background: 'rgba(245,237,214,0.8)', border: '1px solid #c9b49a' }}
                >
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#8B6914]"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 快捷问题 */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-[#c9b49a]/40">
              <div className="text-xs text-[#8B6914] mb-1.5" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                快捷提问：
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-2 py-1 rounded-sm border border-[#c9b49a] text-[#5a4030] hover:bg-[#e8d5a3]/60 hover:border-[#8B6914] transition-colors"
                    style={{ fontFamily: 'Noto Serif SC, serif' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入区 */}
          <div className="px-4 py-3 border-t border-[#c9b49a]/60">
            {/* 输入模式切换 */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setInputMode('text')}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-sm transition-colors ${
                  inputMode === 'text'
                    ? 'bg-[#C0392B] text-white'
                    : 'text-[#8B6914] border border-[#c9b49a] hover:bg-[#e8d5a3]/40'
                }`}
                style={{ fontFamily: 'Noto Serif SC, serif' }}
              >
                <MessageSquare className="w-3 h-3" />
                打字
              </button>
              <button
                onClick={() => setInputMode('voice')}
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-sm transition-colors ${
                  inputMode === 'voice'
                    ? 'bg-[#C0392B] text-white'
                    : 'text-[#8B6914] border border-[#c9b49a] hover:bg-[#e8d5a3]/40'
                }`}
                style={{ fontFamily: 'Noto Serif SC, serif' }}
              >
                <Mic className="w-3 h-3" />
                语音
              </button>
            </div>

            {inputMode === 'text' ? (
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder="向诗仙引路人提问…（Enter发送）"
                  rows={2}
                  className="flex-1 resize-none text-sm px-3 py-2 rounded-sm outline-none"
                  style={{
                    fontFamily: 'Noto Serif SC, serif',
                    background: 'rgba(245,237,214,0.6)',
                    border: '1px solid #c9b49a',
                    color: '#2d1f0f',
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="px-3 py-2 rounded-sm transition-colors disabled:opacity-40"
                  style={{
                    background: '#C0392B',
                    color: '#f5edd6',
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleVoiceInput}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-[#C0392B] scale-110' : 'bg-[#8B6914]'
                  }`}
                  style={{ boxShadow: isListening ? '0 0 20px rgba(192,57,43,0.4)' : 'none' }}
                >
                  {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </button>
                <span className="text-xs text-[#8B6914]" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                  {isListening ? '正在聆听，点击停止…' : '点击开始语音输入'}
                </span>
                {input && (
                  <div className="w-full">
                    <div className="text-xs text-[#5a4030] mb-1 px-1" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                      识别结果：{input}
                    </div>
                    <button
                      onClick={() => sendMessage(input)}
                      className="w-full py-2 text-sm rounded-sm"
                      style={{ background: '#C0392B', color: '#f5edd6', fontFamily: 'Noto Serif SC, serif' }}
                    >
                      发送
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #C0392B, #8B6914, #C0392B)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
