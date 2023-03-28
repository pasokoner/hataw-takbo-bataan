import { type NextPage } from "next";

import React, { useState } from "react";

import ScreenContainer from "../../layouts/ScreenContainer";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../utils/api";

const defaultKey = [
  { key: "three", fill: "#0D632B" },
  { key: "five", fill: "#EB1C24" },
  { key: "ten", fill: "#2D3091" },
];

const Total: NextPage = () => {
  const { data, isLoading } = api.event.getBreakdown.useQuery({
    finishers: false,
  });

  const [dataKey, setDataKey] = useState([
    { key: "three", fill: "#0D632B" },
    { key: "five", fill: "#EB1C24" },
    { key: "ten", fill: "#2D3091" },
  ]);

  const handleChangeKey = (key: string) => {
    if (dataKey.length === 1) {
      setDataKey(defaultKey);
    } else {
      setDataKey((prevState) => prevState.filter((data) => data.key !== key));
    }
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <ScreenContainer className="pt-6">
      <h3 className="mb-2 text-center text-3xl font-medium text-gray-600">
        TOTAL PARTICIPANTS
      </h3>
      <div className="h-[500px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 25,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKey.map(({ key, fill }) => (
              <Bar key={key} dataKey={key} fill={fill} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ScreenContainer>
  );
};

export default Total;
