import React from "react";

const formatDateTime = (dateTime) => {
  if(!dateTime) return;
  const date = new Date(dateTime);

  const formattedDate = date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
  });

  return formattedDate.replace(",", "").replace(" "," às ");
};

const valueInKg = (value) => {
    if(!value) return;

    return `${(value / 1000).toFixed(2)} Kg`;
};

const MeasurementsDashboard = ({ measurements }) => {
    console.log(measurements);
  return(
      <div>

          <h1>Medições da balança</h1>
          <h3>{measurements.length} Medições captadas</h3>
          <h3>Última medição ({formatDateTime(measurements[measurements.length - 1]?.[1])}): {valueInKg(measurements[measurements.length - 1]?.[0])}</h3>
      </div>
  )
};

export default MeasurementsDashboard;
