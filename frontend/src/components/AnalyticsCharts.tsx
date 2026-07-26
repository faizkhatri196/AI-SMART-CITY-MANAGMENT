"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

const powerData = [
  { time: "12:00", gridLoad: 1380, solarGen: 340 },
  { time: "13:00", gridLoad: 1420, solarGen: 360 },
  { time: "14:00", gridLoad: 1450, solarGen: 350 },
  { time: "15:00", gridLoad: 1410, solarGen: 310 },
  { time: "16:00", gridLoad: 1390, solarGen: 280 },
];

const aqiData = [
  { zone: "District 1", aqi: 34 },
  { zone: "District 2", aqi: 48 },
  { zone: "District 3", aqi: 62 },
  { zone: "District 4", aqi: 85 },
  { zone: "District 5", aqi: 41 },
];

export const PowerGridChart: React.FC = () => {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={powerData}>
          <defs>
            <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffb703" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#ffb703" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
          <YAxis stroke="#64748b" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="gridLoad" name="Grid Load (MW)" stroke="#00f2fe" fillOpacity={1} fill="url(#colorGrid)" />
          <Area type="monotone" dataKey="solarGen" name="Solar Gen (MW)" stroke="#ffb703" fillOpacity={1} fill="url(#colorSolar)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AQIBarChart: React.FC = () => {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={aqiData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="zone" stroke="#64748b" fontSize={10} />
          <YAxis stroke="#64748b" fontSize={10} />
          <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
          <Bar dataKey="aqi" name="AQI Index" fill="#06d6a0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
