import React, { useEffect, useRef, useState } from "react";
import { ChromePicker } from "react-color";
import { io } from "socket.io-client";
import './Whiteboard.css';

const socket = io(import.meta.env.VITE_SERVER_URL, {
  transports: ['websocket'],
});

console.log("VITE_SERVER_URL:", import.meta.env.VITE_SERVER_URL);


export default function Whiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000");
  const [thickness, setThickness] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevPoint, setPrevPoint] = useState(null);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("draw", (data) => {
      drawLine(data);
    });

    return () => {
      socket.off("draw");
    };
  }, [roomId]);

  useEffect(() => {
  socket.on("connect", () => {
    console.log("✅ Connected to socket server", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err);
  });
}, []);

  useEffect(() => {
    const loadSavedDrawing = async () => {
      try {
        const SERVER_URL = import.meta.env.VITE_SERVER_URL;
        if (!SERVER_URL) {
          console.error("Missing SERVER_URL");
        } else {
          const res = await fetch(`${SERVER_URL}/api/session/${roomId}`);
        }
        const data = await res.json();
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = data.drawingData;
      } catch (err) {
        console.log("No saved session or failed to load:", err.message);
      }
    };

    loadSavedDrawing();
  }, [roomId]);

  const drawLine = ({ x0, y0, x1, y1, color, thickness }) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    setPrevPoint(getMousePos(e));
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const currPoint = getMousePos(e);
    if (prevPoint) {
      const drawData = {
        x0: prevPoint.x,
        y0: prevPoint.y,
        x1: currPoint.x,
        y1: currPoint.y,
        color: isEraser ? "#FFFFFF" : color,
        thickness: isEraser ? 20 : thickness,
      };
      drawLine(drawData);
      socket.emit("draw", { roomId, data: drawData });
      setPrevPoint(currPoint);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setPrevPoint(null);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const drawingData = canvas.toDataURL();

    socket.emit("save", { roomId, drawing: drawingData });

    alert("Saved!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          width: "fit-content",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div>
            <ChromePicker
              color={color}
              onChangeComplete={(c) => {
                setColor(c.hex);
                setIsEraser(false);
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold" }}>Brush Thickness:</label>
            <input
              type="range"
              min="1"
              max="30"
              value={thickness}
              onChange={(e) => setThickness(parseInt(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <button
            onClick={toggleEraser}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: isEraser ? "#fdd835" : "#2196f3",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {isEraser ? "🖌️ Brush" : "🧽 Eraser"}
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            💾 Save
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            border: "2px solid #333",
            borderRadius: "12px",
            backgroundColor: "#fff",
            cursor: isEraser ? "cell" : "crosshair",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>
    </div>
  );
}
