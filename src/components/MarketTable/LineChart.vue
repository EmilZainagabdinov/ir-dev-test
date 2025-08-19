<template>
  <Line class="chartContainer" :data="chartData" :options="chartOptions" :height="40" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
);

const props = defineProps<{ dataset: number[] }>();

const chartData = computed(() => ({
  labels: props.dataset.map((_, index) => index + 1),
  datasets: [
    {
      label: 'Price',
      data: props.dataset,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.2,
      fill: true,
    },
  ],
}));

const chartOptions = computed(() => {
  const values = props.dataset;
  const hasValues = values.length > 0;
  const maxVal = hasValues && Math.max(...values);
  const isFlat = hasValues && maxVal === 0;

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: isFlat
        ? { display: false, min: -0.2, max: 5 }
        : { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
});

</script>

<style scoped>
.chartContainer {
  border-radius: 0 0 2px 2px;
}
</style>