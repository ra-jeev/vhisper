<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
const props = defineProps<{
  audioData: Uint8Array | null;
  dataUpdateTrigger: number;
}>();

const width = 320;
const height = 48;
const audioCanvas = useTemplateRef('canvas');
const canvasCtx = ref<CanvasRenderingContext2D | null>(null);

onMounted(() => {
  if (audioCanvas.value) {
    canvasCtx.value = audioCanvas.value.getContext('2d');
    if (canvasCtx.value) {
      audioCanvas.value.width = width;
      audioCanvas.value.height = height;
    }
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
  ctx.strokeStyle = 'rgb(221, 0, 0)';
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
  { immediate: true }
);
</script>
