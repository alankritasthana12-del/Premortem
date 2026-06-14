import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Mic, Volume2, VolumeX, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function ChatAgent({ report }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);
  const isIntentionalStopRef = useRef(false);
  const chatHistoryRef = useRef([]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && isOpen) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Stay on continuously
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        // Get the latest transcript from the continuous results
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        
        // BARGE-IN LOGIC: If the AI is speaking and user speaks, shut her up instantly
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
        
        // Automatically send the message
        handleSendVoice(transcript);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isIntentionalStopRef.current = true;
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart if it wasn't intentionally stopped and modal is still open
        if (!isIntentionalStopRef.current && isOpen) {
          try {
            recognition.start();
          } catch (e) {
            console.error("Failed to restart recognition", e);
          }
        }
      };

      recognitionRef.current = recognition;
      isIntentionalStopRef.current = false;
      
      try {
        recognition.start();
      } catch (e) {
        console.error("Failed to start initial recognition", e);
      }

      return () => {
        isIntentionalStopRef.current = true;
        recognition.stop();
      };
    }
  }, [soundEnabled, isOpen, report]);

  const toggleListen = () => {
    if (isListening) {
      isIntentionalStopRef.current = true;
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      isIntentionalStopRef.current = false;
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error("Failed to start recognition manually", e);
      }
    }
  };

  const speakText = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a high-quality female voice
    const voices = window.speechSynthesis.getVoices();
    // Prioritize natural/online voices over robotic defaults
    let femaleVoice = voices.find(v => (v.name.includes('Online') || v.name.includes('Natural')) && (v.name.includes('Female') || v.name.includes('Aria') || v.name.includes('Jenny')));
    if (!femaleVoice) {
        femaleVoice = voices.find(v => v.name.includes('Google') && v.name.includes('US') && v.name.includes('English'));
    }
    if (!femaleVoice) {
        femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Zira'));
    }
    
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendVoice = async (transcriptText) => {
    if (!transcriptText.trim() || isLoading) return;
    
    chatHistoryRef.current.push({ role: 'user', content: transcriptText });
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/analyze/chat`, {
        message: transcriptText,
        history: chatHistoryRef.current,
        report: report || {}
      });

      const replyText = response.data.response;
      chatHistoryRef.current.push({ role: 'assistant', content: replyText });
      speakText(replyText);
    } catch (err) {
      console.error('Chat error:', err);
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
      background: '#000',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
      boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
    }}>
      {/* 2D Photo Avatar (Full Screen) */}
      <div style={{ 
        flex: 1,
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
            width: '200px',
            height: '200px',
            background: 'var(--primary)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.5,
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
            transform: isSpeaking ? 'scale(1.03)' : 'scale(1)'
          }} 
        />
        
        {/* Top Controls Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className={isSpeaking ? 'pulse-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
            <span style={{ fontWeight: 600, fontSize: 15, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Liv (AI)</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (soundEnabled) window.speechSynthesis.cancel();
              }}
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '8px', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button 
              onClick={() => {
                isIntentionalStopRef.current = true;
                recognitionRef.current?.stop();
                setIsOpen(false);
              }}
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '8px', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Bottom Status & Mic Overlay */}
        <div style={{ 
          position: 'absolute', 
          bottom: 24, left: 0, right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 2
        }}>
          {isLoading && (
            <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '99px', color: 'white', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={14} className="spin" /> Thinking...
            </div>
          )}
          
          <button
            onClick={toggleListen}
            style={{
              background: isListening ? '#f43f5e' : 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              border: isListening ? 'none' : '1px solid rgba(255,255,255,0.2)',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: isListening ? '0 0 24px rgba(244,63,94,0.5)' : '0 8px 16px rgba(0,0,0,0.3)'
            }}
          >
            <Mic size={24} className={isListening ? 'pulse' : ''} />
          </button>
          
          <div style={{ 
            fontSize: 12, 
            color: 'rgba(255,255,255,0.8)',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            fontWeight: 500
          }}>
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening (Always On)...' : 'Microphone Paused'}
          </div>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .7; transform: scale(1.1); } }
        
        .avatar-glow { animation: pulseGlow 2s ease-in-out infinite alternate; }
        @keyframes pulseGlow { 0% { opacity: 0.3; transform: scale(0.9); } 100% { opacity: 0.7; transform: scale(1.2); } }
        
        .pulse-dot { animation: pulseDot 1s ease-in-out infinite; }
        @keyframes pulseDot { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
      `}</style>
    </div>
  );
}
