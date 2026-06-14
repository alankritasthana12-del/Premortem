import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows } from '@react-three/drei';
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, Loader2 } from 'lucide-react';
import axios from 'axios';
import * as THREE from 'three';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// The 3D Avatar component
function Avatar({ isSpeaking }) {
  // Using a generic beautiful female Ready Player Me model
  const { scene } = useGLTF('https://models.readyplayer.me/64b55be9d21ce4ba04a91a9b.glb');
  const group = useRef();

  // Basic mouth movement based on isSpeaking
  useFrame((state) => {
    if (!group.current) return;
    
    // Find jaw bone if possible
    let jawBone = null;
    group.current.traverse((child) => {
      if (child.isBone && (child.name.includes('Jaw') || child.name.includes('jaw'))) {
        jawBone = child;
      }
    });

    if (jawBone) {
      if (isSpeaking) {
        // Randomly flap jaw
        const time = state.clock.getElapsedTime();
        jawBone.rotation.x = Math.max(0, Math.sin(time * 15) * 0.1);
      } else {
        jawBone.rotation.x = THREE.MathUtils.lerp(jawBone.rotation.x, 0, 0.1);
      }
    } else {
       // Fallback animation: slight head bob
       if (isSpeaking) {
          const time = state.clock.getElapsedTime();
          group.current.position.y = Math.sin(time * 10) * 0.02;
       } else {
          group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.1);
       }
    }
  });

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

export default function ChatAgent({ report }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
    if (femaleVoice) utterance.voice = femaleVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/analyze/chat`, {
        message: input,
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
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
          <span style={{ fontWeight: 600, fontSize: 15 }}>Liv (AI Agent)</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
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

      {/* 3D Canvas */}
      <div style={{ height: '200px', background: 'radial-gradient(circle at center, #1e1b4b, #000000)', position: 'relative' }}>
        <Canvas camera={{ position: [0, 0.5, 2.5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-5, -5, -5]} intensity={1} />
          <Suspense fallback={null}>
            <Avatar isSpeaking={isSpeaking} />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
          </Suspense>
        </Canvas>
        
        {/* Simple Status Indicator */}
        <div style={{ 
          position: 'absolute', 
          bottom: 12, left: 12, 
          background: 'rgba(0,0,0,0.5)', 
          padding: '4px 8px', 
          borderRadius: 12, 
          fontSize: 11, 
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>
          {isSpeaking ? (
            <><Mic size={12} color="#22c55e" /> Speaking</>
          ) : (
            <><div style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%' }} /> Listening</>
          )}
        </div>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13, marginTop: '20px' }}>
            Hi! I'm Liv. I have full access to your startup report. Ask me anything about it.
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
      <form onSubmit={handleSend} style={{
        padding: '16px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '8px'
      }}>
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
      `}</style>
    </div>
  );
}
