import React, { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
//TODO: END THE MEET IS CAMERA IS OFF OR GIVE WARNING
//TODO: ADD A TIMER WHEN CAMER AHAS TWO FACES OR THE CAMERA IS OFF, IF ABOVE 20 SECONDS, END THE MEET
const ProctorVideo = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [zeroCount, setZeroCount] = useState(0);

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
        new faceapi.TinyFaceDetectorOptions(),
      );
      const faceCount = detections.length;

      if (faceCount === 0 || faceCount > 1) {
        setZeroCount((prev) => prev + 1);
      }
      if (zeroCount !== 0) {
        if (zeroCount > 3) {
          endMeeting();
        }
        alert("Warning! Face count is unusual. Fix Immediately.");
      }
    };

    const intervalId = setInterval(detectFaces, 2000);

    return () => clearInterval(intervalId);
    //eslint-disable-next-line
  }, []);

  const endMeeting = () => {
    console.log("Meeting Ended!");
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    alert("Meeting Ended!");
  };

  return <video ref={videoRef} autoPlay muted />;
};

export default ProctorVideo;
