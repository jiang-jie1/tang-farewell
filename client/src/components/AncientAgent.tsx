/*
 * AncientAgent.tsx - 古风智能体对话组件
 * 设计：古风UI，支持文字输入和语音交互
 * 语音流程：MediaRecorder录音 → base64上传S3 → Whisper转文字 → 填入输入框
 * API：调用火山引擎 Doubao 模型（通过后端代理）
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, MicOff, MessageSquare, Volume2, VolumeX } from 'lucide-react';
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

type VoiceState = 'idle' | 'recording' | 'uploading' | 'transcribing' | 'done' | 'error';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  // 语音录音状态
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputMode === 'text' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, inputMode]);

  // 切换到文字模式时停止录音
  useEffect(() => {
    if (inputMode === 'text') {
      stopRecording();
    }
  }, [inputMode]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const chatMutation = trpc.agent.chat.useMutation();
  const uploadAudioMutation = trpc.agent.uploadAudio.useMutation();
  const transcribeMutation = trpc.agent.transcribe.useMutation();

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: content.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
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

  const stopRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setRecordingSeconds(0);
  }, []);

  const startRecording = useCallback(async () => {
    setVoiceError(null);
    setVoiceState('idle');
    audioChunksRef.current = [];

    // 检查浏览器支持
    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError('您的浏览器不支持麦克风录音，请使用文字输入。');
      setVoiceState('error');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 选择支持的音频格式
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        // 清理麦克风
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        if (audioChunksRef.current.length === 0) {
          setVoiceError('未录到音频，请重试。');
          setVoiceState('error');
          return;
        }

        const actualMime = mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });

        // 检查大小
        if (audioBlob.size > 16 * 1024 * 1024) {
          setVoiceError('录音过长，请控制在2分钟以内。');
          setVoiceState('error');
          return;
        }

        // 上传到S3
        setVoiceState('uploading');
        try {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const uint8 = new Uint8Array(arrayBuffer);
          // 转为base64（兼容所有目标版本）
          let binary = '';
          const chunkSize = 8192;
          for (let i = 0; i < uint8.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, Array.from(uint8.subarray(i, i + chunkSize)));
          }
          const base64 = btoa(binary);

          const uploadResult = await uploadAudioMutation.mutateAsync({
            audioBase64: base64,
            mimeType: actualMime.split(';')[0], // 只取主类型
          });

          // 调用Whisper转文字
          setVoiceState('transcribing');
          const transcribeResult = await transcribeMutation.mutateAsync({
            audioUrl: uploadResult.url,
          });

          const text = transcribeResult.text?.trim();
          if (text) {
            setInput(text);
            setVoiceState('done');
            // 自动切换到文字模式显示识别结果
            setInputMode('text');
            setTimeout(() => inputRef.current?.focus(), 100);
          } else {
            setVoiceError('未能识别到语音内容，请重试。');
            setVoiceState('error');
          }
        } catch (err: any) {
          console.error('Voice transcription error:', err);
          setVoiceError(err?.message || '语音识别失败，请重试或使用文字输入。');
          setVoiceState('error');
        }
      };

      recorder.start(100); // 每100ms收集一次数据
      setVoiceState('recording');
      setRecordingSeconds(0);

      // 录音计时
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => {
          if (s >= 120) {
            // 超过2分钟自动停止
            stopRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);

    } catch (err: any) {
      console.error('Microphone error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setVoiceError('麦克风权限被拒绝，请在浏览器设置中允许使用麦克风。');
      } else if (err.name === 'NotFoundError') {
        setVoiceError('未找到麦克风设备，请检查设备连接。');
      } else {
        setVoiceError('无法启动录音：' + (err.message || '未知错误'));
      }
      setVoiceState('error');
    }
  }, [stopRecording, uploadAudioMutation, transcribeMutation]);

  const handleVoiceButtonClick = () => {
    if (voiceState === 'recording') {
      stopRecording();
    } else if (voiceState === 'idle' || voiceState === 'done' || voiceState === 'error') {
      startRecording();
    }
  };

  const voiceStateLabel = () => {
    switch (voiceState) {
      case 'recording': return `正在录音 ${recordingSeconds}s，点击停止`;
      case 'uploading': return '正在上传音频…';
      case 'transcribing': return '正在识别语音…';
      case 'done': return '识别完成，已填入输入框';
      case 'error': return voiceError || '发生错误，请重试';
      default: return '点击开始录音';
    }
  };

  const isProcessing = voiceState === 'uploading' || voiceState === 'transcribing';

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
                  style={{ background: '#C0392B', color: '#f5edd6' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-1">
                {/* 录音按钮 */}
                <button
                  onClick={handleVoiceButtonClick}
                  disabled={isProcessing}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    voiceState === 'recording'
                      ? 'bg-[#C0392B] scale-110'
                      : voiceState === 'error'
                      ? 'bg-[#8B4513]'
                      : 'bg-[#8B6914]'
                  }`}
                  style={{
                    boxShadow: voiceState === 'recording'
                      ? '0 0 0 8px rgba(192,57,43,0.15), 0 0 20px rgba(192,57,43,0.4)'
                      : 'none',
                  }}
                >
                  {isProcessing ? (
                    <motion.div
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : voiceState === 'recording' ? (
                    <MicOff className="w-7 h-7 text-white" />
                  ) : (
                    <Mic className="w-7 h-7 text-white" />
                  )}
                </button>

                {/* 录音波形动画 */}
                {voiceState === 'recording' && (
                  <div className="flex items-center gap-0.5 h-5">
                    {[0, 1, 2, 3, 4].map(i => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-[#C0392B]"
                        animate={{ height: ['4px', '16px', '4px'] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* 状态文字 */}
                <span
                  className={`text-xs text-center leading-5 ${
                    voiceState === 'error' ? 'text-[#C0392B]' : 'text-[#8B6914]'
                  }`}
                  style={{ fontFamily: 'Noto Serif SC, serif' }}
                >
                  {voiceStateLabel()}
                </span>

                {/* 识别结果预览（done状态已切换到text模式，此处不需要显示） */}
              </div>
            )}
          </div>

          <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #C0392B, #8B6914, #C0392B)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
