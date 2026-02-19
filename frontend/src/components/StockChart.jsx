import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function StockChart({ history, title = 'Stock History' }) {
  const data = {
    labels: history.map((item) => new Date(item.timestamp || item.date).toLocaleTimeString()),
    datasets: [
      {
        label: title,
        data: history.map((item) => item.price),
        borderColor: '#00e0ff',
        backgroundColor: 'rgba(0,224,255,0.25)',
        tension: 0.35,
        fill: true
      }
    ]
  };

  return (
    <div className="card">
      <Line data={data} />
    </div>
  );
}
