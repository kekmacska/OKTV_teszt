import * as echarts from 'echarts';

const backHomepage_button: HTMLButtonElement = document.querySelector(".back-homepage") as HTMLButtonElement;

function loadScore(key: string): number | null {
  const raw:string|null = localStorage.getItem(key);
  if (!raw || raw.trim() === "") return null;
  const n:number = Number(raw);
  return Number.isNaN(n) ? null : n;
}

const osszpontszam:number|null = loadScore("Összpontszám");
const ITpontok:number|null = loadScore("IT pontok");
const FrontendPontok:number|null = loadScore("Frontend pontok");
const BackendPontok:number|null = loadScore("Backend pontok");
const SoftDevPontok:number|null = loadScore("Szoftverfejlesztő pontok");

const topicMax:number = 90;
const allMax:number = 450;

const pontok:(number|null)[] = [ITpontok, FrontendPontok, BackendPontok, SoftDevPontok, osszpontszam];
if (pontok.some(s => s === null)) {
  throw new Error("Hiba történt a pontszámítás során");
}

type BarData = { label: string; value: number; img: string; big?: boolean };
const data: BarData[] = [
  { label: 'IT', value: ITpontok! / topicMax, img: 'value_images/it.svg' },
  { label: 'Frontend', value: FrontendPontok! / topicMax, img: 'value_images/frontend.svg' },
  { label: 'Backend', value: BackendPontok! / topicMax, img: 'value_images/backend.svg' },
  { label: 'Szoftverfejlesztés', value: SoftDevPontok! / topicMax, img: 'value_images/software_development.svg' },
  { label: 'Összpontszám', value: osszpontszam! / allMax, img: 'value_images/overall.svg', big: true }
];

const COLORS:string[] = ['#A91409', '#CC7A00', '#7E7200', '#719331', '#7D1F8D'];

/* -------------------------
   Chart creation
   ------------------------- */
function ensureContainer(selector: string): HTMLDivElement {
  const el:HTMLDivElement|null = document.querySelector(selector) as HTMLDivElement | null;
  if (!el) throw new Error(`Container not found: ${selector}`);
  if (el.clientWidth === 0 || el.clientHeight === 0) {
    throw new Error('Container has zero width or height.');
  }
  return el;
}

function createOption(): echarts.EChartsOption {
  const labels:string[] = data.map(d => d.label);
  const values:number[] = data.map(d => d.value);

  return {
    grid: {
      left: 80,
      right: 40,
      top: 20,
      bottom: 20,
      containLabel: true
    },

    xAxis: {
      type: 'value',
      max: 1,
      show: false
    },

    yAxis: {
      type: 'category',
      data: labels,
      inverse: true,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: '#333' }
    },

    series: [
      {
        type: 'bar',
        data: values,
        barWidth: 48,
        itemStyle: {
          color: (p: any) => COLORS[p.dataIndex],
          borderRadius: 10
        },
        label: {
          show: true,
          position: 'right',
          formatter: (p: any) => Math.round(p.value * 100) + '%',
          color: '#333',
          fontSize: 12
        }
      },

      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        z: 10,

        symbolSize: (val: any, params: any) =>
          data[params.dataIndex].big ? 48 : 32,

        symbolOffset: [10, 0],

        data: data.map((d, i) => ({
          value: [0.02, i],
          symbol: `image://${d.img}`
        })),

        label: {
          show: true,
          position: 'right',
          offset: [10, 0],
          formatter: (p: any) => `${pontok[p.dataIndex]} pont`,
          color: '#fff',
          fontSize: 14
        }
      }
    ]
  };
}

let chartInstance: echarts.ECharts | null = null;

function initChart(): void {
  const container:HTMLDivElement = ensureContainer('.bar-chart')as HTMLDivElement;

  const existing:echarts.ECharts|undefined = echarts.getInstanceByDom(container);
  if (existing) echarts.dispose(container);

  chartInstance = echarts.init(container);
  chartInstance.setOption(createOption());
  chartInstance.resize();

  (window as any).chartInstance = chartInstance;

  window.addEventListener('resize', () => {
    chartInstance?.resize();
  });
}

function waitForContainerAndInit(selector = '.bar-chart') {
  const el:HTMLElement|null = document.querySelector(selector) as HTMLElement | null;
  if (!el) throw new Error(`Container not found: ${selector}`);
  if (el.clientWidth > 0 && el.clientHeight > 0) {
    initChart();
    return;
  }
  const ro = new ResizeObserver(entries => {
    for (const entry of entries) {
      if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        ro.disconnect();
        initChart();
        return;
      }
    }
  });
  ro.observe(el);
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    waitForContainerAndInit();
  } catch (err) {
    console.error(err);
  }
});

backHomepage_button.addEventListener('dblclick', () => { window.location.href = './index.html' });