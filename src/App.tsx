import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

interface Sample {
  id: number
  name: string
  category: string
  genre: string
  play: () => void
}

const ALL_SAMPLES: Array<{ name: string; category: string; genre: string; create: (ctx: AudioContext) => { play: () => void } }> = [
  // Kicks (10)
  { name: 'Kick Deep', category: 'Kick', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(120, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Kick Punchy', category: 'Kick', genre: 'Techno', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Kick Sub', category: 'Kick', genre: 'Dubstep', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(60, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.5); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.65) } } } },
  { name: 'Kick Tight', category: 'Kick', genre: 'Drum & Bass', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(180, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Kick Boomy', category: 'Kick', genre: 'Hip-Hop', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(100, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.4); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.55) } } } },
  { name: 'Kick 808', category: 'Kick', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(180, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.1); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.65) } } } },
  { name: 'Kick 808 Deep', category: 'Kick', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(140, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.15); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.85) } } } },
  { name: 'Kick Hard', category: 'Kick', genre: 'Hardstyle', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(250, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.06); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: 'Kick Soft', category: 'Kick', genre: 'Lo-Fi', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(80, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.5) } } } },
  { name: 'Kick Electronic', category: 'Kick', genre: 'Electronic', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.35) } } } },
  
  // Snares (10)
  { name: 'Snare Tight', category: 'Snare', genre: 'House', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1000; const g = ctx.createGain(); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Snare Fat', category: 'Snare', genre: 'Hip-Hop', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1000; const g = ctx.createGain(); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); const o = ctx.createOscillator(); const og = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 200; og.gain.setValueAtTime(0.3, ctx.currentTime); og.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); n.connect(f); f.connect(g); o.connect(og); g.connect(ctx.destination); og.connect(ctx.destination); return { play: () => { n.start(); o.start(); n.stop(ctx.currentTime + 0.2); o.stop(ctx.currentTime + 0.15) } } } },
  { name: 'Snare 808', category: 'Snare', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000; const og = ctx.createGain(); const ng = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 180; og.gain.setValueAtTime(0.6, ctx.currentTime); og.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); ng.gain.setValueAtTime(0.4, ctx.currentTime); ng.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); n.connect(f); f.connect(ng); o.connect(og); ng.connect(ctx.destination); og.connect(ctx.destination); return { play: () => { o.start(); n.start(); o.stop(ctx.currentTime + 0.2); n.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Snare Clap', category: 'Snare', genre: 'Techno', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 1; const g = ctx.createGain(); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Snare Rimshot', category: 'Snare', genre: 'Rock', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 800; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.05) } } } },
  { name: 'Snare Acoustic', category: 'Snare', genre: 'Acoustic', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 2; const g = ctx.createGain(); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Snare Breaks', category: 'Snare', genre: 'Breaks', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000; const g = ctx.createGain(); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.15) } } } },
  { name: 'Snare Lo-Fi', category: 'Snare', genre: 'Lo-Fi', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.25, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.8; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 5000; const g = ctx.createGain(); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.25) } } } },
  { name: 'Snare Dirty', category: 'Snare', genre: 'Gabber', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2500; f.Q.value = 5; const g = ctx.createGain(); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.1) } } } },
  { name: 'Snare Crisp', category: 'Snare', genre: 'Pop', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5000; const g = ctx.createGain(); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.12) } } } },

  // Hi-Hats (10)
  { name: 'Hi-Hat Closed', category: 'Hi-Hat', genre: 'Universal', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = ctx.createGain(); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.1) } } } },
  { name: 'Hi-Hat Open', category: 'Hi-Hat', genre: 'House', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = ctx.createGain(); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.5) } } } },
  { name: 'Hi-Hat Pedal', category: 'Hi-Hat', genre: 'Jazz', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000; const g = ctx.createGain(); g.gain.setValueAtTime(0.35, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Hi-Hat Tight', category: 'Hi-Hat', genre: 'Techno', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 9000; const g = ctx.createGain(); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.05) } } } },
  { name: 'Hi-Hat Crash', category: 'Hi-Hat', genre: 'Trap', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = ctx.createGain(); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 1) } } } },
  { name: 'Hi-Hat 808', category: 'Hi-Hat', genre: 'Trap', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 8000; const g = ctx.createGain(); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.15) } } } },
  { name: 'Hi-Hat Shaker', category: 'Hi-Hat', genre: 'Latin', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 10000; f.Q.value = 2; const g = ctx.createGain(); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.1) } } } },
  { name: 'Hi-Hat Tambourine', category: 'Hi-Hat', genre: 'Pop', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 8000; f.Q.value = 3; const g = ctx.createGain(); g.gain.setValueAtTime(0.35, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Hi-Hat Ride', category: 'Hi-Hat', genre: 'Jazz', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5000; const g = ctx.createGain(); g.gain.setValueAtTime(0.25, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 1.5) } } } },
  { name: 'Hi-Hat Electronic', category: 'Hi-Hat', genre: 'Electronic', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7500; const g = ctx.createGain(); g.gain.setValueAtTime(0.45, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.1) } } } },

  // Toms (10)
  { name: 'Tom Low', category: 'Tom', genre: 'Rock', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(130, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(65, ctx.currentTime + 0.15); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Tom Mid', category: 'Tom', genre: 'Rock', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.12); g.gain.setValueAtTime(0.75, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: 'Tom High', category: 'Tom', genre: 'Rock', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(280, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.1); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Tom Floor', category: 'Tom', genre: 'Rock', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(100, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.85, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.4) } } } },
  { name: 'Tom Electronic', category: 'Tom', genre: 'Electronic', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(250, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(125, ctx.currentTime + 0.1); g.gain.setValueAtTime(0.75, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: 'Tom 808 Low', category: 'Tom', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(100, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.4) } } } },
  { name: 'Tom 808 High', category: 'Tom', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(250, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Tom Jungle', category: 'Tom', genre: 'Jungle', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(180, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.2) } } } },
  { name: 'Tom Acoustic', category: 'Tom', genre: 'Acoustic', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(160, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.14); g.gain.setValueAtTime(0.75, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: 'Tom Percussive', category: 'Tom', genre: 'World', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(220, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.2) } } } },

  // Cymbals (10)
  { name: 'Crash', category: 'Cymbal', genre: 'Rock', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5000; const g = ctx.createGain(); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 2) } } } },
  { name: 'Ride', category: 'Cymbal', genre: 'Jazz', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 2.5, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4500; const g = ctx.createGain(); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 2.5) } } } },
  { name: 'Ride Bell', category: 'Cymbal', genre: 'Jazz', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 3500; g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.6) } } } },
  { name: 'Splash', category: 'Cymbal', genre: 'Rock', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.8, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 6000; const g = ctx.createGain(); g.gain.setValueAtTime(0.35, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.8) } } } },
  { name: 'China', category: 'Cymbal', genre: 'Metal', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 0.5; const g = ctx.createGain(); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 1) } } } },
  { name: 'Cymbal Cowbell', category: 'Cymbal', genre: 'Latin', create: (ctx) => { const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain(); o1.type = 'square'; o2.type = 'square'; o1.frequency.value = 587; o2.frequency.value = 845; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o1.connect(g); o2.connect(g); g.connect(ctx.destination); return { play: () => { o1.start(); o2.start(); o1.stop(ctx.currentTime + 0.3); o2.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Crash Electronic', category: 'Cymbal', genre: 'Electronic', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 5500; const g = ctx.createGain(); g.gain.setValueAtTime(0.35, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 1.2) } } } },
  { name: 'Ride Electronic', category: 'Cymbal', genre: 'Electronic', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 1.8, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4800; const g = ctx.createGain(); g.gain.setValueAtTime(0.28, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 1.8) } } } },
  { name: 'Cymbal Stack', category: 'Cymbal', genre: 'Progressive', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 4000; const g = ctx.createGain(); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 2) } } } },
  { name: 'Cymbal Gong', category: 'Cymbal', genre: 'World', create: (ctx) => { const o = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o2.type = 'sine'; o.frequency.value = 400; o2.frequency.value = 600; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3); o.connect(g); o2.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o2.start(); o.stop(ctx.currentTime + 3.5); o2.stop(ctx.currentTime + 3.5) } } } },

  // Percussion (10)
  { name: 'Clap', category: 'Percussion', genre: 'House', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 1; const g = ctx.createGain(); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Rimshot', category: 'Percussion', genre: 'Rock', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 800; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.05) } } } },
  { name: 'Woodblock High', category: 'Percussion', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 800; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.1) } } } },
  { name: 'Woodblock Low', category: 'Percussion', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 400; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.1) } } } },
  { name: 'Conga High', category: 'Percussion', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(700, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: 'Conga Low', category: 'Percussion', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(400, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.3) } } } },
  { name: 'Bongo High', category: 'Percussion', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(800, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.15) } } } },
  { name: 'Bongo Low', category: 'Percussion', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(500, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.05); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.18) } } } },
  { name: 'Shaker', category: 'Percussion', genre: 'Pop', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 10000; f.Q.value = 2; const g = ctx.createGain(); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.1) } } } },
  { name: 'Maracas', category: 'Percussion', genre: 'Latin', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 5000; f.Q.value = 3; const g = ctx.createGain(); g.gain.setValueAtTime(0.25, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.15) } } } },

  // FX Sounds (10)
  { name: 'FX Laser', category: 'FX', genre: 'Sci-Fi', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(2000, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.35) } } } },
  { name: 'FX Sweep Down', category: 'FX', genre: 'Electronic', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(100, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.2); g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.3) } } } },
  { name: 'FX Blip', category: 'FX', genre: 'Game', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 880; g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.15) } } } },
  { name: 'FX Noise Burst', category: 'FX', genre: 'Industrial', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; const g = ctx.createGain(); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.5) } } } },
  { name: 'FX Wobble', category: 'FX', genre: 'Dubstep', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const lfo = ctx.createOscillator(); const lfoG = ctx.createGain(); lfo.frequency.value = 20; lfoG.gain.value = 200; lfo.connect(lfoG); lfoG.connect(o.frequency); o.type = 'sine'; o.frequency.value = 80; g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); lfo.start(); o.stop(ctx.currentTime + 0.55); lfo.stop(ctx.currentTime + 0.55) } } } },
  { name: 'FX Punch', category: 'FX', genre: 'Fighting', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.05); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.15) } } } },
  { name: 'FX Zap', category: 'FX', genre: 'Sci-Fi', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.setValueAtTime(4000, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1); g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.15) } } } },
  { name: 'FX Ricochet', category: 'FX', genre: 'Game', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(1500, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15); g.gain.setValueAtTime(0.3, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: 'FX Scratch', category: 'FX', genre: 'Hip-Hop', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(i / 100); n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2000; f.Q.value = 5; const g = ctx.createGain(); g.gain.setValueAtTime(0.5, ctx.currentTime); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.35) } } } },
  { name: 'FX Drop', category: 'FX', genre: 'Dubstep', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(2000, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 1.1) } } } },

  // Synth (10)
  { name: 'Synth C', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 261.63; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth D', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 293.66; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth E', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 329.63; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth F', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 349.23; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth G', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 392.00; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth A', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 440.00; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth B', category: 'Synth', genre: 'House', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000; o.type = 'sawtooth'; o.frequency.value = 493.88; g.gain.setValueAtTime(0.5, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.45) } } } },
  { name: 'Synth Hi', category: 'Synth', genre: 'Trance', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 880; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.35) } } } },
  { name: 'Synth Lo', category: 'Synth', genre: 'Dubstep', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = 82.41; g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.65) } } } },
  { name: 'Synth Pluck', category: 'Synth', genre: 'EDM', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(3000, ctx.currentTime); f.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2); o.type = 'sawtooth'; o.frequency.value = 261.63; g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.35) } } } },

  // 808s (10)
  { name: '808 Kick 1', category: '808', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(180, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.55) } } } },
  { name: '808 Kick 2', category: '808', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(140, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15); g.gain.setValueAtTime(1, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.75) } } } },
  { name: '808 Snare', category: '808', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000; const og = ctx.createGain(); const ng = ctx.createGain(); o.type = 'triangle'; o.frequency.value = 180; og.gain.setValueAtTime(0.6, ctx.currentTime); og.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); ng.gain.setValueAtTime(0.4, ctx.currentTime); ng.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15); n.connect(f); f.connect(ng); o.connect(og); ng.connect(ctx.destination); og.connect(ctx.destination); return { play: () => { o.start(); n.start(); o.stop(ctx.currentTime + 0.2); n.stop(ctx.currentTime + 0.3) } } } },
  { name: '808 Hi-Hat', category: '808', genre: 'Trap', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000; const g = ctx.createGain(); g.gain.setValueAtTime(0.35, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.2) } } } },
  { name: '808 Tom', category: '808', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(200, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12); g.gain.setValueAtTime(0.8, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.35) } } } },
  { name: '808 Clap', category: '808', genre: 'Trap', create: (ctx) => { const n = ctx.createBufferSource(); const b = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; n.buffer = b; const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 1.5; const g = ctx.createGain(); g.gain.setValueAtTime(0.6, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25); n.connect(f); f.connect(g); g.connect(ctx.destination); return { play: () => { n.start(); n.stop(ctx.currentTime + 0.3) } } } },
  { name: '808 Rim', category: '808', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 400; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.08) } } } },
  { name: '808 Cowbell', category: '808', genre: 'Trap', create: (ctx) => { const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain(); o1.type = 'square'; o2.type = 'square'; o1.frequency.value = 587; o2.frequency.value = 845; g.gain.setValueAtTime(0.4, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3); o1.connect(g); o2.connect(g); g.connect(ctx.destination); return { play: () => { o1.start(); o2.start(); o1.stop(ctx.currentTime + 0.3); o2.stop(ctx.currentTime + 0.3) } } } },
  { name: '808 Conga', category: '808', genre: 'Trap', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(560, ctx.currentTime); o.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.08); g.gain.setValueAtTime(0.7, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.25) } } } },
  { name: '808 Clave', category: '808', genre: 'Latin', create: (ctx) => { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'square'; o.frequency.value = 2000; g.gain.setValueAtTime(0.35, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05); o.connect(g); g.connect(ctx.destination); return { play: () => { o.start(); o.stop(ctx.currentTime + 0.08) } } } },
]

function App() {
  const [samples, setSamples] = useState<Sample[]>([])
  const [selectedSample, setSelectedSample] = useState<number>(0)
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(100).fill(null).map(() => Array(16).fill(false))
  )
  const [currentStep, setCurrentStep] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tempo, setTempo] = useState(120)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  const intervalRef = useRef<number | null>(null)

  const categories = ['All', 'Kick', 'Snare', 'Hi-Hat', 'Tom', 'Cymbal', 'Percussion', 'FX', 'Synth', '808']

  useEffect(() => {
    const loadedSamples: Sample[] = ALL_SAMPLES.map((s, i) => ({
      id: i,
      name: s.name,
      category: s.category,
      genre: s.genre,
      play: () => {
        const ctx = new AudioContext()
        const sound = s.create(ctx)
        sound.play()
        setTimeout(() => ctx.close(), 2000)
      }
    }))
    
    setSamples(loadedSamples)
  }, [])

  const playSound = useCallback((sampleId: number) => {
    const sample = samples.find(s => s.id === sampleId)
    if (sample) {
      sample.play()
    }
  }, [samples])

  const toggleStep = useCallback((sampleId: number, step: number) => {
    setGrid(prev => {
      const newGrid = prev.map(row => [...row])
      newGrid[sampleId][step] = !newGrid[sampleId][step]
      return newGrid
    })
  }, [])

  useEffect(() => {
    if (currentStep >= 0) {
      grid.forEach((sampleSteps, sampleId) => {
        if (sampleSteps[currentStep]) {
          playSound(sampleId)
        }
      })
    }
  }, [currentStep, grid, playSound])

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / tempo / 4) * 1000
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(prev => (prev + 1) % 16)
      }, interval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setCurrentStep(-1)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, tempo])

  const filteredSamples = samples.filter(s => {
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.genre.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const clearAll = () => {
    setGrid(Array(100).fill(null).map(() => Array(16).fill(false)))
  }

  const randomFill = () => {
    setGrid(prev => prev.map(row => 
      row.map(() => Math.random() > 0.8)
    ))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Step Sequencer</h1>
        <p>100 samples across all genres</p>
      </header>

      <div className="controls">
        <div className="control-row">
          <button 
            className={`btn ${isPlaying ? 'btn-danger' : 'btn-primary'}`}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? '⏸ Stop' : '▶ Play'}
          </button>
          <button className="btn btn-secondary" onClick={clearAll}>
            Clear
          </button>
          <button className="btn btn-secondary" onClick={randomFill}>
            Random
          </button>
        </div>

        <div className="control-row">
          <label className="slider-label">
            <span>Tempo: {tempo} BPM</span>
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="filter-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search samples..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="category-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${categoryFilter === cat ? 'active' : ''}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="sample-list">
          <div className="sample-list-header">
            <h3>Samples ({filteredSamples.length})</h3>
          </div>
          <div className="sample-list-items">
            {filteredSamples.map((sample) => (
              <div
                key={sample.id}
                className={`sample-item ${selectedSample === sample.id ? 'selected' : ''}`}
                onClick={() => setSelectedSample(sample.id)}
                onDoubleClick={() => playSound(sample.id)}
              >
                <span className="sample-name">{sample.name}</span>
                <span className="sample-meta">{sample.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="sequencer">
          <div className="step-numbers">
            <div className="step-spacer"></div>
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className={`step-number ${currentStep === i ? 'active' : ''}`}>
                {i + 1}
              </div>
            ))}
          </div>

          <div className="grid-container">
            {filteredSamples.map((sample) => (
              <div 
                key={sample.id} 
                className={`grid-row ${selectedSample === sample.id ? 'selected' : ''}`}
                onClick={() => setSelectedSample(sample.id)}
              >
                <div 
                  className="sample-label"
                  onDoubleClick={(e) => { e.stopPropagation(); playSound(sample.id); }}
                >
                  {sample.name}
                </div>
                {grid[sample.id].map((active, stepIdx) => (
                  <button
                    key={stepIdx}
                    className={`step ${active ? 'active' : ''} ${currentStep === stepIdx ? 'current' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleStep(sample.id, stepIdx) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
