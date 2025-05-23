<script setup>
import Chart from 'primevue/chart';
import { ref, onMounted, defineProps, computed, watch} from "vue";

const props = defineProps({
  valuesList: {
    type: Array,
    required: true
  }
});

const valuesLista = computed(() => props.valuesList);
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
    return {
        labels: ['Pendentes', 'Atribuidos', 'Aprovados'],
        datasets: [
            {
                label: 'Status',
                data: valuesLista.value,
                backgroundColor: [
                    '#F97316', 
                    '#3B82F6', 
                    '#10B981'  
                ],
                borderWidth: 1
            }
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title:{
              display: true,
              text: "Status Geral",
              font:{
                size:25,
                weight:'bold',
              },
              color: textColor,
              padding:{
                bottom:15
              }
            },
            legend: {
                labels: {
                    color: textColor
                },
                display: false
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display:false,
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

watch(valuesLista, (newValue) => {
  if (newValue) {
    chartData.value = setChartData();
  }
}, { deep: true });

</script>

<template>
    <Chart type="bar" :data="chartData" :options="chartOptions" />
</template>
