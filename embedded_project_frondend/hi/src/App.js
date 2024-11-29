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



//esp 32 data with ai control
import React, { useState, useEffect, useRef } from "react";
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs'; // Import TensorFlow.js

const App = () => {
  // State for sensor data received via WebSocket
  const [data, setData] = useState({
    soil_moisture: null,
    water_level: null,
    light: null,
    humidity: null,
  });

  // State for WebSocket connection status
  const [connected, setConnected] = useState(false);

  // State for image classification predictions
  const [predictions, setPredictions] = useState([]);
  
  // Refs for image and canvas elements
  const imgRef = useRef(null); // Reference to the img DOM element
  const canvasRef = useRef(null); // Reference to a canvas to grab image frames
  const modelRef = useRef(null); // To store the loaded MobileNet model
  const lastImageTimeRef = useRef(Date.now()); // To track the time of the last image classification

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
      setConnected(false);
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
            const ctx = canvasRef.current.getContext('2d');
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

        analyzeFrame(); // Start analyzing frames
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>ESP32 Real-Time Monitoring and MobileNet Classification</h1>

      {/* WebSocket Connection Status */}
      {connected ? (
        <div>
          <h2>Connected to WebSocket</h2>
          <p>Soil Moisture: {data.soil_moisture ?? "Loading..."}</p>
          <p>Water Level: {data.water_level ?? "Loading..."}%</p>
          <p>Light: {data.light === 1 ? "Bright" : "Dark"}</p>
          <p>Humidity: {data.humidity ?? "Loading..."}%</p>
          <button onClick={() => controlMotor("MOTOR_ON")}>Turn Motor ON</button>
        </div>
      ) : (
        <p>Connecting to WebSocket...</p>
      )}

      {/* MJPEG Stream from ESP32 Camera */}
      <img
        ref={imgRef}
        src="http://172.20.10.8:81/stream" // MJPEG stream URL
        alt="Live stream"
        width="640"
        height="480"
        style={{
          border: '2px solid #ccc',
          borderRadius: '8px',
        }}
        crossOrigin="anonymous" // Enable CORS
        onLoad={() => console.log('Image loaded successfully')}
        onError={() => console.error('Failed to load image')}
      />

      {/* Canvas to grab image data from MJPEG stream for classification */}
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: 'none' }} // Hide the canvas element
      ></canvas>

      {/* Display Image Classification Results */}
      <div>
        <h2>Predictions:</h2>
        <ul>
          {predictions.map((prediction, idx) => (
            <li key={idx}>
              {prediction.className} - {Math.round(prediction.probability * 100)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
