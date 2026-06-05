import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Supabase automatically processes the URL hash/code on load.
    // We just need to wait for the session to be established.
    const handleCallback = async () => {
      try {
        // exchangeCodeForSession handles the PKCE flow (code in URL params)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          // Fallback: maybe it was already handled via implicit flow (hash)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            navigate('/', { replace: true });
            return;
          }
          setError(error.message);
          return;
        }
        navigate('/', { replace: true });
      } catch (err) {
        // Final fallback — check if session exists anyway
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            navigate('/', { replace: true });
            return;
          }
        } catch (_) {}
        setError(err.message || 'Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div style={{
        minHeight:'100vh', background:'#000', color:'#fff',
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', padding:'24px', fontFamily:'Inter, sans-serif', textAlign:'center',
      }}>
        <div style={{ width:56, height:56, borderRadius:16, background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
          <svg width="24" height="24" fill="none" stroke="#f43f5e" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <h2 style={{ fontFamily:'Space Grotesk, sans-serif', fontWeight:700, fontSize:20, marginBottom:8 }}>Sign-in failed</h2>
        <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, marginBottom:24, maxWidth:320, lineHeight:1.6 }}>{error}</p>
        <a href="/" style={{ color:'#f87171', fontSize:13, textDecoration:'none' }}>← Back to home</a>
      </div>
    );
  }

  return (
    <div style={{
      minHeight:'100vh', background:'#000', color:'#fff',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:'24px', fontFamily:'Inter, sans-serif',
    }}>
      <div style={{
        width:48, height:48, borderRadius:14, background:'rgba(220,38,38,0.12)',
        border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center',
        justifyContent:'center', marginBottom:16,
        animation:'spin 1s linear infinite',
      }}/>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:13 }}>Signing you in…</p>
    </div>
  );
}
