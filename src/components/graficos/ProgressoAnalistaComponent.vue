
<script setup>
import Chart from 'primevue/chart';
import { ref, onMounted, defineProps, computed } from "vue";

const props = defineProps({
  valuesData: {
    type: Array,
    required: true
  }
});

const chartData = ref();
const chartOptions = ref();

const valueLabels = computed(() => props.valuesData.labels);
const valuesPendentes = computed(() => props.valuesData.pendentes);
const valuesAtribuidos = computed(() => props.valuesData.atribuidos);
const valuesAprovados = computed(() => props.valuesData.aprovados);

const setChartData = () =>  {

    return {
        labels: valueLabels.value,
        datasets: [
            {
                type: 'bar',
                label: 'Pendentes',
                backgroundColor: 'rgb(249, 115, 22)',
                data: valuesPendentes.value
            },
            {
                type: 'bar',
                label: 'Atribuidos',
                backgroundColor: 'rgb(6, 182, 212)',
                data: valuesAtribuidos.value
            },
            {
                type: 'bar',
                label: 'Aprovados',
                backgroundColor: 'rgb(107, 114, 128)',
                data: valuesAprovados.value
            }
        ]
    };
};
const setChartOptions = () =>  {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        indexAxis: 'y',
        responsive:true,
        maintainAspectRatio: false,
        plugins: {
            title:{
              display: true,
              text: "Progresso por Analistas",
              font:{
                size:25
              },
              color: textColor,
              padding:{
                bottom:15
              }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                },
                position: 'bottom'
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display: true,
                    color: surfaceBorder
                }

            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    display:false,
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

</script>


<template>
  <Chart type="bar" :data="chartData" :options="chartOptions" />
</template>
