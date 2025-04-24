import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LossCurve = ({ lossData, currentEpoch }) => {
  const labels = lossData.map((_, index) => index + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Discriminator Loss",
        data: lossData.map((item) => item.d_loss),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointRadius: labels.map((epoch) => (epoch === currentEpoch ? 5 : 0)),
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Generator Loss",
        data: lossData.map((item) => item.g_loss),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        pointRadius: labels.map((epoch) => (epoch === currentEpoch ? 5 : 0)),
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Epoch",
        },
      },
      y: {
        title: {
          display: true,
          text: "Loss",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "DCGAN Losses Over Epochs",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 4,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LossCurve;
