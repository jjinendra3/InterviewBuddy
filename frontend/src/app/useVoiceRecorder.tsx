import { useState, useRef, useCallback } from "react";

export function useVoiceRecorder(
  maxDuration = 20000,
  silenceThreshold = 10,
  silenceTimeout = 3000,
) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceDetectedRef = useRef<boolean>(false);

  const startRecording = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (event) => {
          chunksRef.current.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          chunksRef.current = [];
        };

        mediaRecorder.start();
        setIsRecording(true);

        const audioContext = new (window.AudioContext || window.AudioContext)();
        audioContextRef.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyserRef.current = analyser;

        // Connect media stream to analyser
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        mediaStreamSource.connect(analyser);
        analyser.fftSize = 256; // Frequency bin count
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // Silence detection loop
        const detectSilence = () => {
          analyser.getByteFrequencyData(dataArray);
          let totalVolume = 0;
          for (let i = 0; i < bufferLength; i++) {
            totalVolume += dataArray[i];
          }
          const averageVolume = totalVolume / bufferLength;

          if (averageVolume < silenceThreshold) {
            if (!silenceDetectedRef.current) {
              silenceDetectedRef.current = true;
              silenceTimerRef.current = setTimeout(() => {
                if (mediaRecorder.state === "recording") {
                  console.log("Silence detected, stopping recording");
                  mediaRecorder.stop();
                  setIsRecording(false);
                }
              }, silenceTimeout);
            }
          } else {
            silenceDetectedRef.current = false;
            if (silenceTimerRef.current) {
              clearTimeout(silenceTimerRef.current);
            }
          }

          requestAnimationFrame(detectSilence);
        };

        detectSilence();

        timerRef.current = setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, maxDuration);
      })
      .catch((error) => console.error("Error accessing microphone:", error));
  }, [maxDuration, silenceThreshold, silenceTimeout]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  }, []);

  const endRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioBlob(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    endRecording,
  };
}
