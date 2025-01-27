// import React, { useEffect, useRef, useState } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
// import "@tensorflow/tfjs-backend-webgl";

// const WebcamProctor: React.FC = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const [distractionCount, setDistractionCount] = useState<number>(0);
//   const maxDistractionDuration = 3000; // 3 seconds
//   let distractionStartTime: number | null = null;

//   const loadModelAndDetect = async () => {
//     const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
//     const detectorConfig = {
//       runtime: "tfjs",
//     };
//     const detector = await faceLandmarksDetection.createDetector(
//       model,
//       //eslint-disable-next-line
//       detectorConfig as any,
//     );
//     setLoading(false);

//     const detect = async () => {
//       if (videoRef.current && canvasRef.current) {
//         const predictions = await detector.estimateFaces(videoRef.current);
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         if (!ctx) return;

//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         if (predictions.length > 0) {
//           predictions.forEach((prediction) => {
//             // Draw the facial mesh
//             const keypoints = prediction.keypoints;
//             console.log(keypoints);
//             //     if (keypoints) {
//             //       for (let i = 0; i < keypoints.length; i++) {
//             //         const [x, y] = keypoints[i];
//             //         ctx.beginPath();
//             //         ctx.arc(x, y, 1, 0, 2 * Math.PI);
//             //         ctx.fillStyle = "green";
//             //         ctx.fill();
//             //       }

//             //       const leftEye = keypoints[159]; // Example: Left eye inner corner
//             //       const rightEye = keypoints[386]; // Example: Right eye inner corner
//             //       if (leftEye && rightEye) {
//             //         const [lx, ly] = leftEye;
//             //         const [rx, ry] = rightEye;
//             //         const eyeMidpoint = [(lx + rx) / 2, (ly + ry) / 2];

//             //         const isLookingAway =
//             //           eyeMidpoint[0] < canvas.width * 0.3 ||
//             //           eyeMidpoint[0] > canvas.width * 0.7;

//             //         if (isLookingAway) {
//             //           if (distractionStartTime === null) {
//             //             distractionStartTime = Date.now();
//             //           } else if (Date.now() - distractionStartTime > maxDistractionDuration) {
//             //             setDistractionCount((prev) => prev + 1);
//             //             distractionStartTime = null;
//             //             alert("You seem distracted. Please focus!");
//             //           }
//             //         } else {
//             //           distractionStartTime = null; // Reset if looking straight
//             //         }
//             //       }
//             //     }
//           });
//         }

//         requestAnimationFrame(detect);
//       }
//     };

//     detect();
//   };

//   useEffect(() => {
//     const setupCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: false,
//         });
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//         }
//       } catch (error) {
//         console.error("Error accessing webcam:", error);
//       }
//     };

//     setupCamera();
//     // .then(() => {
//     //   tf.ready().then(() => {
//     //     loadModelAndDetect();
//     //   });
//     // });
//   }, []);

//   return (
//     <div className="bg-red-500 w-full h-full">
//       {loading && <p>Loading TensorFlow.js model...</p>}
//       <video ref={videoRef} className="w-96 h-96 object-cover" />
//       <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
//       {/* <div className="absolute top-2 left-2 text-red-500 font-bold bg-white p-1 rounded">
//         Distraction Count: {distractionCount}
//       </div> */}
//     </div>
//   );
// };

// export default WebcamProctor;
