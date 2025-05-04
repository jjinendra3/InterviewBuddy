"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { ReactNode } from "react";

const MicrophoneContext = createContext({
  microphone: null as MediaStreamAudioSourceNode | null | undefined,
  startMicrophone: () => {},
  setupMicrophone: () => {},
  microphoneState: null as null | 0 | 1 | 2 | 3,
  microphoneAudioContext: undefined as AudioContext | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMicrophoneAudioContext: (_value: AudioContext | undefined) => {},
  processor: null as ScriptProcessorNode | null,
});

const MicrophoneContextProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Possible microphone states:
   * - not setup - null
   * - setting up - 0
   * - ready - 1
   * - open - 2
   * - paused - 3
   */
  const [microphoneState, setMicrophoneState] = useState<null | 0 | 1 | 2 | 3>(
    null
  );
  const [microphone, setMicrophone] = useState<
    MediaStreamAudioSourceNode | undefined
  >();
  const [microphoneAudioContext, setMicrophoneAudioContext] = useState<
    AudioContext | undefined
  >();
  const [processor, setProcessor] = useState<ScriptProcessorNode | null>(null);

  const setupMicrophone = async () => {
    setMicrophoneState(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: false,
        },
      });

      const microphoneAudioContext = new AudioContext();
      const microphone = microphoneAudioContext.createMediaStreamSource(stream);
      const processor = microphoneAudioContext.createScriptProcessor(
        4096,
        1,
        1
      );

      setMicrophone(microphone);
      setMicrophoneAudioContext(microphoneAudioContext);
      setProcessor(processor);
      setMicrophoneState(1);
    } catch (err) {
      console.error(err);
      if (
        err instanceof Error &&
        err.name !== "NotFoundError" &&
        err.name !== "NotAllowedError"
      ) {
        console.log(err.name);
      }
    }
  };

  const startMicrophone = useCallback(() => {
    if (microphone && processor) {
      microphone.connect(processor);
    }
    if (processor && microphoneAudioContext)
      processor.connect(microphoneAudioContext.destination);
    setMicrophoneState(2);
  }, [processor, microphoneAudioContext, microphone]);

  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        startMicrophone,
        // stopMicrophone,
        setupMicrophone,
        microphoneState,
        microphoneAudioContext,
        setMicrophoneAudioContext,
        processor,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

function useMicrophone() {
  return useContext(MicrophoneContext);
}

export { MicrophoneContextProvider, useMicrophone };
