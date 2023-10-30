import React from "react";
import {Head} from "@inertiajs/react";
import {Container} from "./styles";
import GlobalStyle from "../global";
import Chart from "react-apexcharts"

const formatDateTime = (dateTime) => {
  if (!dateTime) return;
  const date = new Date(dateTime);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

const valueInKg = (value) => {
  if (!value) return 0;

  return (value / 1000).toFixed(2);
};

const MeasurementsDashboard = ({ measurements }) => {

  const chartOptions = {
    chart: { type: "line" },
    xaxis: {
      categories: measurements.map((m) => formatDateTime(m[1])),
      labels: { style: { colors: "var(--light-primary)" } },
    },
    yaxis: {labels: {style: {colors: "var(--light-primary)" }}},
    stroke: { curve: "smooth" },
  }

  const chartSeries = [{
    name: "Peso (Kg)",
    data: measurements.map((m) => valueInKg(m[0])),
  }];
  return (
    <>
      <Head title="Scale Dashboard" />
      <GlobalStyle />
      <Container>
        <h1>Medições da balança</h1>
        {measurements.length === 0 ? (
          <h3>Sem dados até o momento</h3>
        ) : (
            <Chart
                options={chartOptions}
                series={chartSeries}
                width={1000}
                height={500}
            />
        )}
      </Container>
    </>
  );
};

export default MeasurementsDashboard;
