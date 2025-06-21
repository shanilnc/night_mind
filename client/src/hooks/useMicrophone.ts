import { useState, useEffect, useRef } from 'react';

export interface UseMicrophoneReturn {
    isSessionActive: boolean;
    volumeLevel: number;
    toggleCall: () => void;
    isPermissionGranted: boolean;
    requestPermission: () => Promise<boolean>;
}

export function useMicrophone(): UseMicrophoneReturn {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const requestPermission = async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsPermissionGranted(true);
            // Don't start the session yet, just check permission
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.error('Microphone permission denied:', error);
            setIsPermissionGranted(false);
            return false;
        }
    };

    const startAudioAnalysis = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);

            microphoneRef.current.connect(analyserRef.current);

            const updateVolume = () => {
                if (analyserRef.current && dataArrayRef.current) {
                    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

                    // Calculate RMS volume
                    let sum = 0;
                    for (let i = 0; i < dataArrayRef.current.length; i++) {
                        sum += dataArrayRef.current[i] * dataArrayRef.current[i];
                    }
                    const rms = Math.sqrt(sum / dataArrayRef.current.length);
                    const normalizedVolume = Math.min(rms / 50, 1); // Normalize to 0-1

                    setVolumeLevel(normalizedVolume);
                }

                if (isSessionActive) {
                    animationFrameRef.current = requestAnimationFrame(updateVolume);
                }
            };

            updateVolume();
        } catch (error) {
            console.error('Error starting audio analysis:', error);
            setIsSessionActive(false);
        }
    };

    const stopAudioAnalysis = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        if (microphoneRef.current) {
            microphoneRef.current.disconnect();
            microphoneRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        analyserRef.current = null;
        dataArrayRef.current = null;
        setVolumeLevel(0);
    };

    const toggleCall = async () => {
        if (!isSessionActive) {
            if (!isPermissionGranted) {
                const granted = await requestPermission();
                if (!granted) return;
            }
            setIsSessionActive(true);
            await startAudioAnalysis();
        } else {
            setIsSessionActive(false);
            stopAudioAnalysis();
        }
    };

    useEffect(() => {
        return () => {
            stopAudioAnalysis();
        };
    }, []);

    useEffect(() => {
        if (!isSessionActive) {
            stopAudioAnalysis();
        }
    }, [isSessionActive]);

    return {
        isSessionActive,
        volumeLevel,
        toggleCall,
        isPermissionGranted,
        requestPermission,
    };
}
