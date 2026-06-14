import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ChatAgent({ report }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        // BARGE-IN LOGIC: If the AI is speaking, shut her up instantly so she can listen
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        // Automatically send the message after transcribing
        handleSendVoice(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [soundEnabled, messages, report]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const speakText = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a nice female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Microsoft Zira'));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendVoice = async (transcriptText) => {
    if (!transcriptText.trim() || isLoading) return;
    await processMessage(transcriptText);
  };

  const handleSendText = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const textToSend = input;
    setInput('');
    await processMessage(textToSend);
  };

  const processMessage = async (text) => {
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/analyze/chat`, {
        message: text,
        history: messages,
        report: report || {}
      });

      const replyText = response.data.response;
      const assistantMessage = { role: 'assistant', content: replyText };
      setMessages(prev => [...prev, assistantMessage]);
      speakText(replyText);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = { role: 'assistant', content: "Sorry, I had trouble processing that. Make sure the backend is running." };
      setMessages(prev => [...prev, errorMessage]);
      speakText("Sorry, I had trouble processing that.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '99px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '15px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
          transition: 'all 0.2s',
        }}
      >
        <MessageSquare size={18} />
        Talk to Liv
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      width: '380px',
      height: '600px',
      background: 'var(--card-bg)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
      boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={isSpeaking ? 'pulse-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Liv (AI Agent)</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (soundEnabled) window.speechSynthesis.cancel();
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2D Photo Avatar */}
      <div style={{ 
        height: '200px', 
        background: '#000', 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Glow behind the image when speaking */}
        {isSpeaking && (
          <div className="avatar-glow" style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            background: 'var(--primary)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.6,
            zIndex: 0
          }} />
        )}
        
        <img 
          src="/avatar.jpg" 
          alt="Liv Avatar" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            transition: 'transform 0.3s ease',
            transform: isSpeaking ? 'scale(1.02)' : 'scale(1)'
          }} 
        />
        
        {/* Status Indicator */}
        <div style={{ 
          position: 'absolute', 
          bottom: 12, left: 12, 
          background: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(4px)',
          padding: '4px 8px', 
          borderRadius: 12, 
          fontSize: 11, 
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 2
        }}>
          {isSpeaking ? (
            <><Mic size={12} color="#22c55e" /> Speaking</>
          ) : isListening ? (
            <><Loader2 size={12} color="#f43f5e" className="spin" /> Listening to you...</>
          ) : (
            <><div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }} /> Idle</>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginTop: '20px' }}>
            Hi! I'm Liv. Click the microphone to speak, or type your message below.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            padding: '12px 16px',
            borderRadius: '16px',
            background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            color: 'white',
            fontSize: '14px',
            lineHeight: 1.5,
            borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
            borderBottomLeftRadius: msg.role === 'user' ? 16 : 4,
          }}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)' }}>
            <Loader2 size={16} className="spin" color="var(--text-secondary)" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendText} style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '8px'
      }}>
        <button
          type="button"
          onClick={toggleListen}
          style={{
            background: isListening ? '#f43f5e' : 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title="Click to speak (Barge-in)"
        >
          <Mic size={18} className={isListening ? 'pulse' : ''} />
        </button>

        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about the report..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '99px',
            padding: '12px 16px',
            color: 'white',
            outline: 'none',
            fontSize: '14px'
          }}
        />
        <button 
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            background: 'var(--primary)',
            border: 'none',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
            opacity: isLoading || !input.trim() ? 0.5 : 1
          }}
        >
          <Send size={16} />
        </button>
      </form>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        
        .avatar-glow { animation: pulseGlow 2s ease-in-out infinite alternate; }
        @keyframes pulseGlow { 0% { opacity: 0.3; transform: scale(0.9); } 100% { opacity: 0.8; transform: scale(1.1); } }
        
        .pulse-dot { animation: pulseDot 1s ease-in-out infinite; }
        @keyframes pulseDot { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
      `}</style>
    </div>
  );
}
