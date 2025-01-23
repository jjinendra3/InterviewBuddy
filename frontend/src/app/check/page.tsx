"use client";
import { useEffect, useState } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  //eslint-disable-next-line
  const [audioContext, setAudioContext] = useState<any>(null);
  //eslint-disable-next-line
  const [mediaStream, setMediaStream] = useState<any>(null);
  //eslint-disable-next-line
  const [silenceDetected, setSilenceDetected] = useState<any>(false);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(
          //eslint-disable-next-line
          (track: any) => track.stop(),
        );
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);

      const context = new (window.AudioContext || window.AudioContext)();
      setAudioContext(context);

      const analyser = context.createAnalyser();
      const microphone = context.createMediaStreamSource(stream);
      microphone.connect(analyser);

      analyser.fftSize = 256; // FFT size (controls frequency resolution)
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkSilence = () => {
        analyser.getByteFrequencyData(dataArray);

        // Calculate the average volume from the frequency data
        let totalVolume = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalVolume += dataArray[i];
        }
        const averageVolume = totalVolume / bufferLength;

        if (averageVolume < 10) {
          stopRecording();
          setSilenceDetected(true);
          return;
        } else {
          setSilenceDetected(false);
        }

        // Continue checking the silence in intervals
        requestAnimationFrame(checkSilence);
      };

      checkSilence();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (audioContext) {
      audioContext.close();
    }
    if (mediaStream) {
      //eslint-disable-next-line
      mediaStream.getTracks().forEach((track: any) => track.stop());
    }
    setSilenceDetected(false);
  };

  return (
    <div>
      <button onClick={() => setIsRecording(!isRecording)}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p>{silenceDetected ? "Silence Detected" : "Recording..."}</p>
    </div>
  );
};

export default AudioRecorder;
