<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "primevue/chart";

const chartData = ref();
const chartOptions = ref();
const dataInicial = ref(null);
const dataFinal = ref(null);
const carregando = ref(false);
const erro = ref(null);

const setChartData = (pendentes, atribuidos, aprovados) => {
  return {
    labels: ["Pendentes", "Atribuídos", "Aprovados"],
    datasets: [
      {
        label: "Status",
        data: [pendentes, atribuidos, aprovados],
        backgroundColor: ["rgb(249, 115, 22)", "rgb(6, 182, 212)", "rgb(107, 114, 128)"],
        borderWidth: 1
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--p-text-muted-color");
  const surfaceBorder = documentStyle.getPropertyValue("--p-content-border-color");

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Status Geral",
        font: {
          size: 25,
          weight: "bold"
        },
        color: textColor,
        padding: {
          bottom: 15
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
          display: false,
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
};

const buscarDados = async () => {
  carregando.value = true;
  erro.value = null;

  try {
    let url = "http://localhost:8080/relatorios/status";

    if (dataInicial.value && dataFinal.value) {
      url += `?dataInicial=${dataInicial.value}&dataFinal=${dataFinal.value}`;
    }

    const token = localStorage.getItem("token");

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    const dados = response.data;

    chartData.value = setChartData(
      dados["totalPendentes"],
      dados["totalAtribuidos"],
      dados["totalAprovados"]
    );
    chartOptions.value = setChartOptions();
  } catch (err) {
    erro.value = "Erro ao carregar dados.";
    console.error(err);
  } finally {
    carregando.value = false;
  }
};

onMounted(() => {
  buscarDados();
});
</script>
