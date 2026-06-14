import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@anam-ai/js-sdk';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function AnamAgent({ report }) {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [client, setClient] = useState(null);
  const [status, setStatus] = useState('Initializing...');
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // We only start the connection when the user clicks "Start Session" to grant mic access
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (client) {
        client.stopStreaming();
      }
    };
  }, [client]);

  const startSession = async () => {
    setHasStarted(true);
    setStatus('Fetching token...');
    
    try {
      // Fetch session token from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://premortem-backend.onrender.com'}/anam/token`);
      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
      }
      
      const data = await response.json();
      const sessionToken = data.sessionToken;
      
      setStatus('Connecting to Anam...');
      
      // Initialize the SDK Client
      const anamClient = createClient(sessionToken, {
        disableInputAudio: false
      });
      setClient(anamClient);

      // Start the stream
      if (document.getElementById('anam-video-element')) {
        await anamClient.streamToVideoElement('anam-video-element');
        setStatus('Connected');
        setIsConnected(true);

        // Inject Context now that we are connected
        if (report) {
          const contextData = `CRITICAL INSTRUCTION: You are an AI assistant whose SOLE purpose is to explain the following startup analysis report. Do not answer questions outside the scope of this report.
          
          REPORT DETAILS:
          Startup Name: ${report?.startup?.name}
          Threat Level: ${report?.overallRisk}%
          Success Probability: ${report?.successProbability}%
          Executive Summary: ${report?.executiveSummary || 'N/A'}`;
          
          try {
            // Give it a brief moment to settle the WebRTC connection before sending context
            setTimeout(() => {
              anamClient.addContext(contextData);
              console.log("Report Context Injected via SDK!");
            }, 1000);
          } catch (e) {
            console.error("Context injection failed", e);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setStatus('Connection Failed. (Check console, you may have reached concurrency limits!)');
      setHasStarted(false);
    }
  };

  const toggleMute = () => {
    if (client) {
      if (isMuted) {
        client.unmuteMic();
      } else {
        client.muteMic();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      {/* Start Session Button - relocated to bottom left */}
      {!hasStarted && (
        <button 
          onClick={startSession}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 9999,
            background: 'linear-gradient(90deg, #f43f5e, #fb923c)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '999px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 16px rgba(244,63,94,0.4)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          👋 Talk to Liv
        </button>
      )}

      {/* Video Window - kept on bottom right, but made smaller */}
      {hasStarted && (
        <div style={{ 
          position: 'fixed', 
          bottom: '24px', 
          right: '24px', 
          zIndex: 9999,
          width: '220px', // Made the window smaller
          aspectRatio: '9/16',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#111',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {!isConnected && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              gap: '8px',
              textAlign: 'center',
              padding: '20px'
            }}>
              <Loader2 className="animate-spin" size={24} color="#f43f5e" />
              {status}
            </div>
          )}
          
          <video 
            id="anam-video-element"
            ref={videoRef}
            autoPlay 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isConnected ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          />

          {isConnected && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px'
            }}>
              <button 
                onClick={toggleMute}
                style={{
                  background: isMuted ? '#f43f5e' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(4px)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
