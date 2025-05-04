"use client";

import { createContext, useContext, useState, useRef } from "react";
import { sendKeepAliveMessage } from "../lib/utils/deepgramUtils";

const DeepgramContext = createContext<{
  socket: WebSocket | null;
  socketState: number;
  rateLimited: boolean;
  connectToDeepgram: () => void;
}>({
  socket: null,
  socketState: -1,
  rateLimited: false,
  connectToDeepgram: () => {},
});

import { ReactNode } from "react";

const DeepgramContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketState, setSocketState] = useState(-1);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const keepAlive = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;

  const connectToDeepgram = async () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log("Max reconnect attempts reached.");
      setRateLimited(true);
      return;
    }

    setSocketState(0);

    const newSocket = new WebSocket("wss://agent.deepgram.com/agent", [
      "token",
      process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY ?? "",
    ]);

    const onOpen = () => {
      setSocketState(1);
      setReconnectAttempts(0);
      console.log("WebSocket connected.");
      keepAlive.current = setInterval(sendKeepAliveMessage(newSocket), 10000);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onError = (err: any) => {
      setSocketState(2); // error
      console.error("Websocket error", err);
    };

    const onClose = () => {
      clearInterval(keepAlive.current as NodeJS.Timeout);
      setSocketState(3); // closed
      console.info("WebSocket closed. Attempting to reconnect...");
      setTimeout(connectToDeepgram, 3000); // reconnect after 3 seconds
      setReconnectAttempts((attempts) => attempts + 1);
    };

    const onMessage = () => {
      // console.info("message", e);
    };

    newSocket.binaryType = "arraybuffer";
    newSocket.addEventListener("open", onOpen);
    newSocket.addEventListener("error", onError);
    newSocket.addEventListener("close", onClose);
    newSocket.addEventListener("message", onMessage);

    setSocket(newSocket);
  };

  return (
    <DeepgramContext.Provider
      value={{
        socket,
        socketState,
        rateLimited,
        connectToDeepgram,
      }}
    >
      {children}
    </DeepgramContext.Provider>
  );
};

function useDeepgram() {
  return useContext(DeepgramContext);
}

export { DeepgramContextProvider, useDeepgram };
