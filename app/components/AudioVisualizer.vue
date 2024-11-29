<template>
  <canvas ref="canvas" width="640" height="100" />
</template>

<script setup lang="ts">
const props = defineProps<{
  audioData: Uint8Array | null;
  dataUpdateTrigger: number;
}>();

let width = 0;
let height = 0;
const audioCanvas = useTemplateRef<HTMLCanvasElement>("canvas");
const canvasCtx = ref<CanvasRenderingContext2D | null>(null);

onMounted(() => {
  if (audioCanvas.value) {
    canvasCtx.value = audioCanvas.value.getContext("2d");
    width = audioCanvas.value.width;
    height = audioCanvas.value.height;
  }
});

const drawCanvas = () => {
  if (!canvasCtx.value || !props.audioData) {
    return;
  }

  const data = props.audioData;
  const ctx = canvasCtx.value;
  const sliceWidth = width / data.length;

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgb(221, 72, 49)";
  ctx.beginPath();

  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] ?? 0) / 128.0;
    const y = (v * height) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(width, height / 2);
  ctx.stroke();
};

watch(
  () => props.dataUpdateTrigger,
  () => {
    drawCanvas();
  },
  { immediate: true },
);
</script>
