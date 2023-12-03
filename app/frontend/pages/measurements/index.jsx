import React, {useCallback, useState} from "react";
import {Head, router} from "@inertiajs/react";
import {ChartContainer, Page, SelectBox} from "./styles";
import GlobalStyle from "../global";
import Chart from "react-apexcharts"
import Select from 'react-select'

const formatDateTime = (dateTime) => {
  if (!dateTime) return;
  const date = new Date(dateTime);

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};

const valueInKg = (value) => {
  if (!value) return 0;

  return (value / 1000).toFixed(2);
};

const MeasurementsDashboard = ({ measurements }) => {
  // const [timeFilter, setTimeFilter] = useState(null);

  const options = [
    { value: null, label: 'Todas as medições' },
    { value: 15, label: '15 minutos' },
    { value: 30, label: '30 minutos' },
    { value: 60, label: '1 hora' },
    { value: 120, label: '2 horas' },
    { value: 240, label: '4 horas' },
    { value: 480, label: '8 horas' }
  ]

  const filterMeasurements = useCallback((timeFilter) => router.get(`/?time_interval=${timeFilter}`, {}, { preserveState: true}), []);

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
      <Page>
        <h1>Medições da balança</h1>

        <SelectBox>
          <h4>Filtrar por intervalo de tempo</h4>
          <Select options={options} onChange={(e) => filterMeasurements(e.value)}/>
        </SelectBox>
        <ChartContainer>
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
        </ChartContainer>
      </Page>
    </>
  );
};

export default MeasurementsDashboard;
