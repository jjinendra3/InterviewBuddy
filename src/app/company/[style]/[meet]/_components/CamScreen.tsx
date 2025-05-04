import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import { toaster } from "@/components/toast";

const ProctorVideo = ({
  mediaStream,
  setMediaStream,
}: {
  mediaStream: MediaStream | null;
  setMediaStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const enableVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam", error);
      }
    };
    enableVideoStream();
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const detectFaces = async () => {
      if (!videoRef.current) return;

      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions()
      );
      const faceCount = detections.length;
      if (faceCount > 1) toaster(`Face Count: ${faceCount}`);

    };

    const intervalId = setInterval(detectFaces, 2000);

    return () => clearInterval(intervalId);
    //eslint-disable-next-line
  }, []);

  return <video ref={videoRef} autoPlay muted />;
};

export default ProctorVideo;
