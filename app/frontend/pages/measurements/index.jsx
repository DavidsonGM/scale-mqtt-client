import React, { useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import {
  ChartContainer,
  Header,
  MeasurementsChart,
  Page,
  SelectBox,
  Statistics,
  StatisticCard,
} from "./styles";
import GlobalStyle from "../global";
import Chart from "react-apexcharts";
import Select from "react-select";
import Card from "@/components/Card";
import { FaClock } from "react-icons/fa";
import { RiRefreshFill } from "react-icons/ri";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { TbMathMax } from "react-icons/tb";

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

const MeasurementsDashboard = ({ measurements, statistics, lastUpdate }) => {
  const options = [
    { value: "", label: "Todas as medições" },
    { value: 15, label: "15 minutos" },
    { value: 30, label: "30 minutos" },
    { value: 60, label: "1 hora" },
    { value: 120, label: "2 horas" },
    { value: 240, label: "4 horas" },
    { value: 480, label: "8 horas" },
  ];

  const filterMeasurements = useCallback(
    (timeFilter) =>
      router.get(`/?time_interval=${timeFilter}`, {}, { preserveState: true }),
    [],
  );

  const chartOptions = {
    chart: { type: "line" },
    xaxis: {
      categories: measurements.map((m) => formatDateTime(m[1])),
      labels: { style: { colors: "var(--light-primary)" } },
    },
    yaxis: { labels: { style: { colors: "var(--light-primary)" } } },
    stroke: { curve: "smooth" },
  };

  const chartSeries = [
    {
      name: "Peso (Kg)",
      data: measurements.map((m) => valueInKg(m[0])),
    },
  ];

  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0,
  );

  const selectStyles = {
    control: (base) => ({
      ...base,
      height: 30,
      minHeight: 30,
      backgroundColor: "var(--light-primary)",
      borderColor: "var(--light-primary)",
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: 30,
      padding: "0 6px",
      // backgroundColor: "blue"
    }),

    input: (provided) => ({
      ...provided,
      // margin: '0px',
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: 25,
    }),
  };

  return (
    <>
      <Head title="Scale Dashboard" />
      <GlobalStyle />
      <Page>
        <Header>
          <SelectBox>
            <h4>Filtrar por intervalo de tempo</h4>
            <div style={{ width: "50%" }}>
              <Select
                options={options}
                styles={selectStyles}
                onChange={(e) => filterMeasurements(e.value)}
              />
            </div>
          </SelectBox>
          <h4>
            Atualizado em: {formatDateTime(lastUpdate)}
            <RiRefreshFill
              style={{ cursor: "pointer" }}
              onClick={() =>
                router.delete("/clear_cache", {
                  data: {
                    time_interval: new URLSearchParams(
                      window.location.search,
                    ).get("time_interval"),
                  },
                })
              }
            />
          </h4>
        </Header>

        <Card style={{ flex: 4 }}>
          <MeasurementsChart>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h1>Medições da balança</h1>
            </div>
            <ChartContainer>
              {measurements.length === 0 ? (
                <h3>Sem dados até o momento</h3>
              ) : (
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  width={0.9 * vw}
                  height={480}
                />
              )}
            </ChartContainer>
          </MeasurementsChart>
        </Card>
        <Statistics>
          <Card>
            <StatisticCard>
              <h3>Valor máximo (Últimos 7 dias)</h3>
              <span>
                <TbMathMax />
                {valueInKg(statistics.max)} kg
              </span>
            </StatisticCard>
          </Card>
          <Card>
            <StatisticCard>
              <h3>Variação (Última medição)</h3>
              <span>
                {statistics.growth < 0 ? (
                  <FaArrowTrendDown color="red" />
                ) : (
                  <FaArrowTrendUp color="green" />
                )}
                {Math.round(statistics.growth * 10000) / 100} %
              </span>
            </StatisticCard>
          </Card>
          <Card>
            <StatisticCard>
              <h3>Variação média (Últimos 7 dias)</h3>
              <span>
                {statistics.average_growth < 0 ? (
                  <FaArrowTrendDown color="red" />
                ) : (
                  <FaArrowTrendUp color="green" />
                )}
                {valueInKg(statistics.average_growth)} kg/h
              </span>
            </StatisticCard>
          </Card>
          <Card>
            <StatisticCard>
              <h3>Estimativa para próxima coleta</h3>
              <span>
                <FaClock />
                {statistics.fill_prevision}
              </span>
            </StatisticCard>
          </Card>
        </Statistics>
      </Page>
    </>
  );
};

export default MeasurementsDashboard;
