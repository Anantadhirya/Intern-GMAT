import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

export default function App() {
  const [socket, setSocket] = useState();

  useEffect(
    function () {
      if (socket) return;
      const socketio = io("http://13.113.187.150:5001");
      console.log("connected");
      setSocket(socketio);
    },
    [socket]
  );

  useEffect(
    function () {
      if (!socket) return;
      socket.on("DATA", (payload) => {
        console.log(payload);
      });
    },
    [socket]
  );

  return (
    <div>
      <div>Test</div>
    </div>
  );
}
