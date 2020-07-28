import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import { format, addDays } from "date-fns";
import _ from "lodash";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const App = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(addDays(new Date(), -90));
  const [counter, setCounter] = useState(90);

  useEffect(() => {
    const fetchData = async () => {
      const [responseUSD, responseEUR] = await Promise.all([
        axios.get(
          `https://api.exchangeratesapi.io/${format(
            date,
            "yyyy-MM-dd"
          )}?base=USD&symbols=RUB`
        ),
        axios.get(
          `https://api.exchangeratesapi.io/${format(
            date,
            "yyyy-MM-dd"
          )}?base=EUR&symbols=RUB`
        ),
      ]);

      const dataNew = [].concat(
        convertRates(responseUSD.data),
        convertRates(responseEUR.data)
      );

      const grouped = _.groupBy(dataNew, "time");
      console.log(grouped, data)
      for (const [key, value] of Object.entries(grouped)) {
        const row = { time: key };
        for (const item of value) {
          if (Object.keys(item)[1] === "USD") {
            row[Object.keys(item)[1]] = item.USD;
          }
          if (Object.keys(item)[1] === "EUR") {
            row[Object.keys(item)[1]] = item.EUR;
          }
        }
        setData([...data, row]);
      }
    };
    fetchData();
  }, [date]);

  const convertRates = (rates) => {
    switch (rates.base) {
      case "USD":
        return {
          time: format(new Date(rates["date"]), "dd.MM"),
          USD: rates["rates"].RUB,
        };
      case "EUR":
        return {
          time: format(new Date(rates["date"]), "dd.MM"),
          EUR: rates["rates"].RUB,
        };
      default:
        return 0;
    }
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    setDate(addDays(new Date(), -counter));
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className="chart">
      <div>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            bottom: 5,
            left: -20,
          }}
        >
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="time" domain={["auto", "auto"]} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="linear"
            dataKey="EUR"
            stroke="#8884d8"
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="linear"
            dataKey="USD"
            stroke="#82ca9d"
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>

        <div className="table">
          <div>Дата</div>
          <div>USD</div>
          <div>EUR</div>
          {data !== undefined &&
            data.map((item, i) => (
              <React.Fragment key={i}>
                <div>{item.time}</div>
                <div>{item.USD}</div>
                <div>{item.EUR}</div>
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default App;
