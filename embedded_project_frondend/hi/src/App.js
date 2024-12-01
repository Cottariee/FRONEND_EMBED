// import React, { useState, useEffect } from 'react';

// function App() {
//   const [sensorData, setSensorData] = useState({
//     humidity: null,
//     soilMoisture: null,
//     waterLevel: null,
//     lightStatus: null,
//   });

//   const [motorState, setMotorState] = useState(false);

//   useEffect(() => {
//     // Connect to the WebSocket server hosted on ESP32
//     const socket = new WebSocket('ws://localhost:81'); // Update with your ESP32's IP if needed

//     // Listen for incoming data from the WebSocket server
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       // Check if the data contains humidity, and if so, update it
//       if (data.humidity !== undefined) {
//         setSensorData(prevData => ({ ...prevData, humidity: data.humidity }));
//       } else {
//         // Otherwise, update the rest of the data
//         setSensorData(prevData => ({
//           ...prevData,
//           soilMoisture: data.soilMoisture,
//           waterLevel: data.waterLevel,
//           lightStatus: data.lightStatus,
//         }));
//       }
//     };

//     // Cleanup: Disconnect from WebSocket when the component unmounts
//     return () => socket.close();
//   }, []);

//   // Send WebSocket message to turn motor on or off
//   const handleMotorControl = (action) => {
//     const socket = new WebSocket('ws://localhost:81'); // Update with your ESP32's IP if needed
//     socket.onopen = () => {
//       socket.send(action); // Send "turnOnMotor" or "turnOffMotor"
//       setMotorState(action === "turnOnMotor"); // Update motor state in frontend
//     };
//   };

//   return (
//     <div className="App">
//       <h1>Real-time Sensor Data</h1>
//       <p>Humidity: {sensorData.humidity !== null ? `${sensorData.humidity.toFixed(2)}%` : 'Loading...'}</p>
//       <p>Soil Moisture: {sensorData.soilMoisture !== null ? `${sensorData.soilMoisture}%` : 'Loading...'}</p>
//       <p>Water Level: {sensorData.waterLevel !== null ? `${sensorData.waterLevel}%` : 'Loading...'}</p>
//       <p>Light Status: {sensorData.lightStatus || 'Loading...'}</p>

//       <button onClick={() => handleMotorControl("turnOnMotor")}>
//         {motorState ? "Motor is ON" : "Turn ON Motor"}
//       </button>
//       <button onClick={() => handleMotorControl("turnOffMotor")}>
//         Turn OFF Motor
//       </button>
//     </div>
//   );
// }

// export default App;



//esp 32 data pure
// import React, { useState, useEffect } from "react";

// const App = () => {
//   const [data, setData] = useState({
//     soil_moisture: null,
//     water_level: null,
//     light: null,
//     humidity: null,
//   });
//   const [connected, setConnected] = useState(false);

//   useEffect(() => {
//     console.log("hi")
//     const socket = new WebSocket("ws://172.20.10.5:81");

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");  
//       setConnected(true);
//     };

//     socket.onmessage = (event) => {
//       const receivedData = JSON.parse(event.data);
//       console.log("Received:", receivedData);
//       setData((prevData) => ({ ...prevData, ...receivedData }));
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//       setConnected(false);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const controlMotor = (command) => {
//     const socket = new WebSocket("ws://172.20.10.5:81");
//     socket.onopen = () => {
//       socket.send(command);
//       socket.close();
//     };
//   };

//   return (
//     <div className="App">
//       <h1>ESP32 Real-Time Monitoring</h1>
//       {connected ? (
//         <div>
//           <h2>Connected to WebSocket</h2>
//           <p>Soil Moisture: {data.soil_moisture ?? "Loading..."}</p>
//           <p>Water Level: {data.water_level ?? "Loading..."}%</p>
//           <p>Light: {data.light === 1 ? "Bright" : "Dark"}</p>
//           <p>Humidity: {data.humidity ?? "Loading..."}%</p>
//           <button onClick={() => controlMotor("MOTOR_ON")}>Turn Motor ON</button>
//           {/* <button onClick={() => controlMotor("MOTOR_OFF")}>Turn Motor OFF</button> */}
//         </div>
//       ) : (
//         <p>Connecting to WebSocket...</p>
//       )}
//       {/* <video
//       src="http://192.168.4.1"
//       controls
//       autoPlay
//       style={{ width: "80%" }}
//       /> */}

//    <iframe
//         src={"http://172.20.10.3"}
//         width="640"
//         height="480"
//         frameBorder="0"
//         allow="camera; microphone"
//         title="ESP32-CAM Stream"
//         style={{
//           border: '2px solid #ccc',
//           borderRadius: '8px',
//         }}
//       ></iframe>

//      {/* <div style={{ textAlign: "center" }}>
//       <h1>ESP32-CAM Live Stream</h1>
//       <img
//         src={"http://192.168.4.1"}
//         alt="ESP32-CAM Stream"
//         style={{ width: "80%", border: "1px solid black" }}
//       />
//     </div> */}

//     </div>
//   );
// };

// export default App;

// ai pure
// import React, { useState, useEffect, useRef } from 'react';
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import '@tensorflow/tfjs'; // Import TensorFlow.js

// const App = () => {
//   const [predictions, setPredictions] = useState([]);
//   const imgRef = useRef(null); // Reference to the img DOM element
//   const canvasRef = useRef(null); // Reference to a canvas to grab image frames
//   const modelRef = useRef(null); // To store the loaded model
//   const lastImageTimeRef = useRef(Date.now()); // To track the time of the last image classification

//   useEffect(() => {
//     if (imgRef.current && canvasRef.current) {
//       // Load the MobileNet model once
//       mobilenet.load().then((model) => {
//         modelRef.current = model; // Store the model in the ref
//         console.log("Model loaded");

//         // Start the frame analysis
//         const analyzeFrame = async () => {
//           if (imgRef.current.complete) {
//             const ctx = canvasRef.current.getContext('2d');
//             ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

//             // Get the image data from the canvas and classify the image only if 1 second has passed since last prediction
//             const currentTime = Date.now();
//             if (currentTime - lastImageTimeRef.current > 1000) {
//               lastImageTimeRef.current = currentTime; // Update the last classification time
//               const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

//               const newPredictions = await modelRef.current.classify(imageData);
//               setPredictions(newPredictions);
//             }
//           }

//           requestAnimationFrame(analyzeFrame); // Repeat the frame analysis
//         };

//         analyzeFrame(); // Start analyzing frames
//       });
//     }
//   }, []); // Run once when component mounts

//   return (
//     <div className="App">
//       <h1>MobileNet Image Classification from MJPEG Stream</h1>
      
//       {/* MJPEG Stream as image */}
//       <img
//         ref={imgRef}
//         src="http://172.20.10.8:81/stream" // MJPEG stream URL
//         alt="Live stream"
//         width="640"
//         height="480"
//         style={{
//           border: '2px solid #ccc',
//           borderRadius: '8px',
//         }}
//         crossOrigin="anonymous" // Enable CORS
//         onLoad={() => console.log('Image loaded successfully')}
//         onError={() => console.error('Failed to load image')}
//       />

//       {/* Canvas to grab image data from the <img> stream */}
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         style={{ display: 'none' }} // Hide the canvas element
//       ></canvas>

//       {/* Display Classifications */}
//       <div>
//         <h2>Predictions:</h2>
//         <ul>
//           {predictions.map((prediction, idx) => (
//             <li key={idx}>
//               {prediction.className} - {Math.round(prediction.probability * 100)}%
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default App;

//*----------------------*

//esp 32 data with ai control
// import React, { useState, useEffect, useRef } from "react";
// import * as mobilenet from '@tensorflow-models/mobilenet';
// import '@tensorflow/tfjs'; // Import TensorFlow.js

// const App = () => {
//   // State for sensor data received via WebSocket
//   const [data, setData] = useState({
//     soil_moisture: null,
//     water_level: null,
//     light: null,
//     humidity: null,
//   });

//   // State for WebSocket connection status
//   const [connected, setConnected] = useState(false);

//   // State for image classification predictions
//   const [predictions, setPredictions] = useState([]);
  
  

//   // Refs for image and canvas elements
//   const imgRef = useRef(null); // Reference to the img DOM element
//   const canvasRef = useRef(null); // Reference to a canvas to grab image frames
//   const modelRef = useRef(null); // To store the loaded MobileNet model
//   const lastImageTimeRef = useRef(Date.now()); // To track the time of the last image classification

//   // WebSocket connection setup
//   useEffect(() => {
//     console.log("Connecting to WebSocket...");
//     const socket = new WebSocket("ws://172.20.10.5:81");

//     socket.onopen = () => {
//       console.log("Connected to WebSocket server");
//       setConnected(true);
//     };

//     socket.onmessage = (event) => {
//       const receivedData = JSON.parse(event.data);
//       console.log("Received:", receivedData);
//       setData((prevData) => ({ ...prevData, ...receivedData }));
//     };

//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     socket.onclose = () => {
//       console.log("Disconnected from WebSocket server");
//       setConnected(false);
//     };

//     return () => {
//       socket.close();
//     };
//   }, []);

//   // Control motor function via WebSocket
//   const controlMotor = (command) => {
//     const socket = new WebSocket("ws://172.20.10.5:81");
//     socket.onopen = () => {
//       socket.send(command);
//       socket.close();
//     };
//   };

//   // Load MobileNet model and start image classification
//   useEffect(() => {
//     if (imgRef.current && canvasRef.current) {
//       mobilenet.load().then((model) => {
//         modelRef.current = model;
//         console.log("MobileNet model loaded");

//         const analyzeFrame = async () => {
//           if (imgRef.current.complete) {
//             const ctx = canvasRef.current.getContext('2d');
//             ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

//             // Only classify every 1 second
//             const currentTime = Date.now();
//             if (currentTime - lastImageTimeRef.current > 1000) {
//               lastImageTimeRef.current = currentTime; // Update the last classification time
//               const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
//               const newPredictions = await modelRef.current.classify(imageData);
//               setPredictions(newPredictions);
//             }
//           }
//           requestAnimationFrame(analyzeFrame); // Continue analyzing frames
//         };

//         analyzeFrame(); // Start analyzing frames
//       });
//     }
//   }, []);

//   return (
//     <div className="App">
//       <h1>ESP32 Real-Time Monitoring and MobileNet Classification</h1>

//       {/* WebSocket Connection Status */}
//       {connected ? (
//         <div>
//           <h2>Connected to WebSocket</h2>
//           <p>Soil Moisture: {data.soil_moisture ?? "Loading..."}</p>
//           <p>Water Level: {data.water_level ?? "Loading..."}%</p>
//           <p>Light: {data.light === 1 ? "Bright" : "Dark"}</p>
//           <p>Humidity: {data.humidity ?? "Loading..."}%</p>
//           <button onClick={() => controlMotor("MOTOR_ON")}>Turn Motor ON</button>
//         </div>
//       ) : (
//         <p>Connecting to WebSocket...</p>
//       )}

//       {/* MJPEG Stream from ESP32 Camera */}
//       <img
//         ref={imgRef}
//         src="http://172.20.10.8:81/stream" // MJPEG stream URL
//         alt="Live stream"
//         width="640"
//         height="480"
//         style={{
//           border: '2px solid #ccc',
//           borderRadius: '8px',
//         }}
//         crossOrigin="anonymous" // Enable CORS
//         onLoad={() => console.log('Image loaded successfully')}
//         onError={() => console.error('Failed to load image')}
//       />

//       {/* Canvas to grab image data from MJPEG stream for classification */}
//       <canvas
//         ref={canvasRef}
//         width="640"
//         height="480"
//         style={{ display: 'none' }} // Hide the canvas element
//       ></canvas>

//       {/* Display Image Classification Results */}
//       <div>
//         <h2>Predictions:</h2>
//         <ul>
//           {predictions.map((prediction, idx) => (
//             <li key={idx}>
//               {prediction.className} - {Math.round(prediction.probability * 100)}%
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default App;

//*--------------------*

import React, { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { FiAlertCircle } from "react-icons/fi";
import "@tensorflow/tfjs";

const App = () => {
  const [data, setData] = useState({
    soil_moisture: null,
    water_level: null,
    light: null,
    humidity: null,
  });

  // State for WebSocket connection status
  const [connected, setConnected] = useState(false); //เปลี่ยนเป็น false

  // State for image classification predictions
  const [predictions, setPredictions] = useState([
    { className: "Worm", probability: 0.9 },
    { className: "Latae", probability: 0.75 },
    { className: "Serumnara", probability: 0.958382}
  ]); //ใส่ค่าไว้อย่าลืมเอาออกตอนใช้

  // Refs for image and canvas elements
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const lastImageTimeRef = useRef(Date.now());

  // WebSocket connection setup
  useEffect(() => {
    console.log("Connecting to WebSocket...");
    const socket = new WebSocket("ws://172.20.10.5:81");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log("Received:", receivedData);
      setData((prevData) => ({ ...prevData, ...receivedData }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
      setConnected(true); //ตอนรันจิงเปลี่ยนตรงนี้เป็น false ด้วย
    };

    return () => {
      socket.close();
    };
  }, []);

  // Control motor function via WebSocket
  const controlMotor = (command) => {
    const socket = new WebSocket("ws://172.20.10.5:81");
    socket.onopen = () => {
      socket.send(command);
      socket.close();
    };
  };

  // Load MobileNet model and start image classification
  useEffect(() => {
    if (imgRef.current && canvasRef.current) {
      mobilenet.load().then((model) => {
        modelRef.current = model;
        console.log("MobileNet model loaded");

        const analyzeFrame = async () => {
          if (imgRef.current.complete) {
            const ctx = canvasRef.current.getContext("2d");
            ctx.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

            // Only classify every 1 second
            const currentTime = Date.now();
            if (currentTime - lastImageTimeRef.current > 1000) {
              lastImageTimeRef.current = currentTime; // Update the last classification time
              const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
              const newPredictions = await modelRef.current.classify(imageData);
              setPredictions(newPredictions);
            }
          }
          requestAnimationFrame(analyzeFrame); // Continue analyzing frames
        };

        analyzeFrame(); //Start analyzing frames
      });
    }
  }, []);

  //จำลองการส่งค่า เซนเซ้อ เขียนไงวะ🤨
  useEffect(() => {
    if (connected) {
      const interval = setInterval(() => {
        setData({
          soil_moisture: Math.floor(Math.random() * 100), // ตัวเลขสุ่มระหว่าง 0-100
          water_level: Math.floor(Math.random() * 100),
          light: Math.random() > 0.5 ? 1 : 0, // สลับระหว่าง Bright และ Dark
          humidity: Math.floor(Math.random() * 100),
        });
      }, 3000);

      return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
    }
  }, [connected]);



  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800 shadow-lg p-4">
        <h1 className="text-2xl font-bold text-center text-blue-400">ESP32 Real-Time Monitoring & AI Control</h1>
      </header>

      <main className="container mx-auto p-4 grid grid-cols-2">
        {/* WebSocket Status */}
        {/* ตรงนี้เเก้เยอะสุดถ้ามันพังกรุณามารับชมตรงก่อนเลอ  */}
        <div className="grid gap-1 m-6 ">
          <div
            className={`p-6 rounded-lg shadow-lg ${
              connected ? "bg-sky-900 h-72" : "bg-red-500 h-72"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">
              {connected ? "Connected to WebSocket" : "Disconnected"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Soil Moisture</p>
                <p className="text-2xl font-bold">
                  {data.soil_moisture ?? "Loading..."}
                </p>
              </div>
              <div>
                <p className="font-medium">Water Level</p>
                <p className="text-2xl font-bold">
                  {data.water_level !== null
                    ? `${data.water_level}%`
                    : "Loading..."}
                </p>
              </div>
              <div>
                <p className="font-medium">Light</p>
                <p className="text-2xl font-bold">
                  {data.light === 1 ? "Bright" : "Dark"}
                </p>
              </div>
              <div>
                <p className="font-medium">Humidity</p>
                <p className="text-2xl font-bold">
                  {data.humidity !== null
                    ? `${data.humidity}%`
                    : "Loading..."}
                </p>
              </div>
            </div>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded transition-transform transform hover:scale-105"
              onClick={() => controlMotor("MOTOR_ON")}
            >
              Turn Motor ON
            </button>
          </div>
          {/* <div className="p-6 rounded-lg shadow-lg bg-sky-900 h-72 place-content-center">
          {connected ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Soil Moisture</p>
                <p className="text-2xl font-bold">
                  {data.soil_moisture ?? "Loading..."}
                </p>
              </div>
              <div>
                <p className="font-medium">Water Level</p>
                <p className="text-2xl font-bold">
                  {data.water_level !== null
                    ? `${data.water_level}%`
                    : "Loading..."}
                </p>
              </div>
              <div>
                <p className="font-medium">Light</p>
                <p className="text-2xl font-bold">
                  {data.light === 1 ? "Bright" : "Dark"}
                </p>
              </div>
              <div>
                <p className="font-medium">Humidity</p>
                <p className="text-2xl font-bold">
                  {data.humidity !== null
                    ? `${data.humidity}%`
                    : "Loading..."}
                </p>
              </div>
            </div>
          ) : (
              <FiAlertCircle className="ml-60 text-red-500 w-10 h-10" />
          )}
          </div> */}
        </div>

        {/* Camera Stream */}
        <div>
        <div className="flex justify-center mb-6">
          <img
            ref={imgRef}
            src="http://172.20.10.8:81/stream"
            alt="Live stream"
            className="border-4 border-blue-400 rounded-lg shadow-lg"
            width="640"
            height="400"
          />
        </div>

        {/* Predictions */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-300">Image Classification Predictions</h2>
          <ul className="list-disc grid grid-cols-2">
            {predictions.length > 0 ? (
              predictions.map((prediction, idx) => (
              <div
                key={idx}
                className=" bg-gray-700 p-2 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-600 transition-shadow m-4 "
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {prediction.className}
                </h3>
                <p className="text-lg text-gray-300">
                  Confidence:{" "}
                  <span className="font-bold text-green-400">
                    {Math.round(prediction.probability * 100)}%
                  </span>
                </p>
              </div>
              ))
            ) : (
              <p>No predictions yet. Please wait...</p>
            )}
          </ul>
        </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 text-center py-4">
        <p>© 2024 IoT Solutions Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;