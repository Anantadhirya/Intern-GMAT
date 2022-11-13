import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Chart from "./components/Chart";
import GPS from "./components/GPS";

export default function App() {
  const [socket, setSocket] = useState();
  const [data, setData] = useState();
  const [clocks, setClocks] = useState([]);
  const [yaws, setYaws] = useState([]);
  const [pitchs, setPitchs] = useState([]);
  const [rolls, setRolls] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [voltages, setVoltages] = useState([]);
  const [pressures, setPressures] = useState([]);
  const [altitudes, setAltitudes] = useState([]);

  // Connect to Back-End
  useEffect(
    function () {
      if (socket) return;
      const socketio = io("http://13.113.187.150:5001");
      setSocket(socketio);
    },
    [socket]
  );
  // Input data from Back-End
  useEffect(
    function () {
      if (!socket) return;
      socket.on("DATA", (payload) => {
        const dataArray = payload.slice(0, -1).split(",");

        setData(dataArray[0]);
        setClocks((clocks) => [...clocks, dataArray[1]]);
        setYaws((yaws) => [...yaws, Number(dataArray[2])]);
        setPitchs((pitchs) => [...pitchs, Number(dataArray[3])]);
        setRolls((rolls) => [...rolls, Number(dataArray[4])]);
        setLatitude(Number(dataArray[5]));
        setLongitude(Number(dataArray[6]));
        setVoltages((voltages) => [...voltages, Number(dataArray[7])]);
        setPressures((pressures) => [...pressures, Number(dataArray[8])]);
        setAltitudes((altitudes) => [...altitudes, Number(dataArray[9])]);
      });
    },
    [socket]
  );

  // Delete older data
  useEffect(
    function () {
      if (clocks.length < 1) return;
      const [hours, minutes, seconds] = clocks[clocks.length - 1].split(":");
      const currentTime = new Date();
      currentTime.setHours(hours);
      currentTime.setMinutes(minutes);
      currentTime.setSeconds(seconds);
      const [hours2, minutes2, seconds2] = clocks[0].split(":");
      const olderTime = new Date();
      olderTime.setHours(hours2);
      olderTime.setMinutes(minutes2);
      olderTime.setSeconds(seconds2);
      const day = 24 * 3600 * 1000;
      const timeRange = 60 * 1000;
      if ((currentTime - olderTime + day) % day > timeRange) {
        setClocks((clocks) => clocks.slice(1));
        setYaws((yaws) => yaws.slice(1));
        setPitchs((pitchs) => pitchs.slice(1));
        setRolls((rolls) => rolls.slice(1));
        setVoltages((voltages) => voltages.slice(1));
        setPressures((pressures) => pressures.slice(1));
        setAltitudes((altitudes) => altitudes.slice(1));
      }
    },
    [clocks]
  );
  // App
  return (
    <div>
      <div>Test</div>
      <Chart x={clocks} y={voltages} title="Voltage Chart" />
      <GPS latitude={latitude} longitude={longitude} />
    </div>
  );
}
