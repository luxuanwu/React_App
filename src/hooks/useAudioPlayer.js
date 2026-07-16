import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_VOLUME = 72;

function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef(null);
  const volumeRef = useRef(DEFAULT_VOLUME);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    return audioContextRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (!audioNodesRef.current) {
      return;
    }

    audioNodesRef.current.oscillators.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch (error) {
        // Oscillators can only be stopped once.
      }
    });

    audioNodesRef.current = null;
  }, []);

  const startAudio = useCallback((item) => {
    const audioContext = getAudioContext();
    audioContext.resume();
    stopAudio();

    const mainOscillator = audioContext.createOscillator();
    const harmonyOscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();

    mainOscillator.type = item.wave;
    mainOscillator.frequency.value = item.frequency;
    harmonyOscillator.type = 'sine';
    harmonyOscillator.frequency.value = item.frequency * 1.5;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 1200;
    gainNode.gain.value = (volumeRef.current / 100) * 0.12;

    mainOscillator.connect(filterNode);
    harmonyOscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    mainOscillator.start();
    harmonyOscillator.start();

    audioNodesRef.current = {
      gainNode,
      oscillators: [mainOscillator, harmonyOscillator]
    };
  }, [getAudioContext, stopAudio]);

  const playTrack = useCallback((item) => {
    setCurrentTrack(item);
    setIsPlaying(true);
  }, []);

  const togglePlayback = useCallback(() => {
    setIsPlaying((value) => !value);
  }, []);

  const setVolume = useCallback((value) => {
    volumeRef.current = value;

    if (audioNodesRef.current) {
      audioNodesRef.current.gainNode.gain.value = (value / 100) * 0.12;
    }
  }, []);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      startAudio(currentTrack);
    } else {
      stopAudio();
    }

    return () => {
      stopAudio();
    };
  }, [currentTrack, isPlaying, startAudio, stopAudio]);

  useEffect(() => {
    return () => {
      stopAudio();
      audioContextRef.current?.close();
    };
  }, [stopAudio]);

  return {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlayback,
    setVolume,
    stopAudio
  };
}

export default useAudioPlayer;
