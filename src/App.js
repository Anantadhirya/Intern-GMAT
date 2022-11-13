import { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { io } from "socket.io-client";
import Chart from "./components/Chart";
import GPS from "./components/GPS";

export default function App() {
  const [socket, setSocket] = useState();
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
      const timeRange = 30 * 1000;
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
    <div className="container">
      <div className="identitas">
        <div>Name: Daniel Anantadhirya Adyawisesa Linan</div>
        <div>NIM: 22/492989/TK/53975</div>
      </div>
      <div className="row">
        <div className="box">
          <Plot
            data={[
              {
                x: clocks,
                y: yaws,
                name: "Yaw",
                mode: "lines",
                line: { color: "red" },
              },
              {
                x: clocks,
                y: pitchs,
                name: "Pitch",
                mode: "lines",
                line: { color: "blue" },
              },
              {
                x: clocks,
                y: rolls,
                name: "Roll",
                mode: "lines",
                line: { color: "green" },
              },
            ]}
            layout={{ width: 600, height: 400, title: "Gyroscope" }}
          />
        </div>
        <div className="box">
          <GPS latitude={latitude} longitude={longitude} />
        </div>
      </div>
      <div className="row">
        <div className="box">
          <Chart x={clocks} y={altitudes} title="Altitude" />
        </div>
        <div className="box">
          <Chart x={clocks} y={pressures} title="Pressure" />
        </div>
        <div className="box">
          <Chart x={clocks} y={voltages} title="Voltage" />
        </div>
      </div>
    </div>
  );
}
