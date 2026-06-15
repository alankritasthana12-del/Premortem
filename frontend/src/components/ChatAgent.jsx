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
  
  // Drag state
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  
  const recognitionRef = useRef(null);
  const isIntentionalStopRef = useRef(false);
  const chatHistoryRef = useRef([]);

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && isOpen) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true; // Enable interim results for instant reaction
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      // Fired the millisecond sound is detected
      recognition.onspeechstart = () => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
      };

      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const result = event.results[lastResultIndex];
        
        // INSTANT BARGE-IN: If AI is speaking and ANY sound is picked up, shut her up immediately.
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
        
        // Only send to Gemini once the user has finished their sentence
        if (result.isFinal) {
          const transcript = result[0].transcript;
          handleSendVoice(transcript);
        }
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
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error("Failed to restart recognition", e);
            }
          }, 200);
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

  // Drag logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: window.innerHeight - e.clientY - dragStartPos.current.y
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    if (isOpen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen]);

  const handleDragStart = (e) => {
    isDragging.current = true;
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: (window.innerHeight - e.clientY) - position.y
    };
  };

  const handleMicClick = () => {
    // 1. If she is speaking, ALWAYS shut her up when mic is clicked
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      
      // Make sure mic is turned on to capture the interruption
      if (!isListening) {
        isIntentionalStopRef.current = false;
        try { recognitionRef.current?.start(); } catch(e){}
      }
      return;
    }

    // 2. Normal toggle
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

  const speakText = (rawText) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    // Strip markdown formatting characters so she doesn't read them aloud
    const text = rawText.replace(/[*#_`]/g, '');
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a high-quality female voice
    const voices = window.speechSynthesis.getVoices();
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
        history: chatHistoryRef.current.slice(0, -1), // Exclude the message we just pushed
        report: report || {}
      });

      const replyText = response.data.response;
      chatHistoryRef.current.push({ role: 'assistant', content: replyText });
      speakText(replyText);
    } catch (err) {
      console.error('Chat error:', err.response?.data?.detail || err.message || err);
      if (err.response?.status === 429) {
        speakText("I'm getting a little overwhelmed! Give me just a few seconds to catch my breath before you ask the next question.");
      } else {
        speakText("Sorry, I had trouble processing that.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        className="pm-btn-primary"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          borderRadius: '99px',
          padding: '12px 24px',
          boxShadow: '0 8px 32px rgba(220,38,38,0.3)',
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
      bottom: `${position.y}px`,
      left: `${position.x}px`,
      maxWidth: '85vw',
      maxHeight: '85vh',
      background: '#000',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
      boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
    }}>
      {/* 2D Photo Avatar (Auto Size) */}
      <div style={{ 
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
            background: 'var(--accent)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            opacity: 0.5,
            zIndex: 0
          }} />
        )}
        
        <img 
          src="/avatar.jpg" 
          alt="Liv Avatar" 
          draggable="false"
          style={{
            width: '320px', /* Base width */
            maxWidth: '100%',
            height: 'auto', /* Aspect ratio maintained naturally */
            maxHeight: '80vh',
            objectFit: 'contain',
            zIndex: 1,
            transition: 'transform 0.3s ease',
            transform: isSpeaking ? 'scale(1.03)' : 'scale(1)'
          }} 
        />
        
        {/* Top Drag Handle Overlay */}
        <div 
          onMouseDown={handleDragStart}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
            zIndex: 2,
            cursor: 'grab',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className={isSpeaking ? 'pulse-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
            <span style={{ fontWeight: 600, fontSize: 15, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Liv (AI)</span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled(!soundEnabled);
                  if (soundEnabled) window.speechSynthesis.cancel();
              }}
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '8px', borderRadius: '50%', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
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
          zIndex: 2,
          pointerEvents: 'none' /* let dragging pass through unless on button */
        }}>
          {isLoading && (
            <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '99px', color: 'white', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={14} className="spin" /> Thinking...
            </div>
          )}
          
          <button
            onClick={handleMicClick}
            style={{
              pointerEvents: 'auto',
              background: isListening ? 'var(--accent)' : 'rgba(0,0,0,0.6)',
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
              boxShadow: isListening ? '0 0 24px rgba(220,38,38,0.5)' : '0 8px 16px rgba(0,0,0,0.3)'
            }}
          >
            <Mic size={24} className={isListening ? 'pulse' : ''} />
          </button>
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
