<template>
  <UContainer class="min-h-screen flex flex-col items-center justify-center">
    <UCard class="w-full max-w-4xl" @submit.prevent="saveNote">
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">Add Note</h1>
          <UButton
            class="ml-4"
            :icon="
              isRecording ? 'i-heroicons-stop-circle' : 'i-heroicons-microphone'
            "
            :color="isRecording ? 'red' : 'gray'"
            :disabled="loading"
            @click="toggleRecording"
          >
            {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
          </UButton>
        </div>
      </template>

      <div class="space-y-6">
        <!-- Recording status and visualizer -->
        <div v-if="isRecording" class="space-y-4">
          <div class="flex items-center space-x-2 text-red-500">
            <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Recording... {{ formatDuration(recordingDuration) }}</span>
          </div>

          <!-- Audio Visualizer -->
          <div class="h-24 bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
            <canvas ref="visualizer" class="w-full h-full" />
          </div>
        </div>

        <!-- Transcription progress -->
        <UProgress
          v-if="isTranscribing"
          color="primary"
          class="w-full"
          animation="carousel"
        />

        <!-- Main textarea -->
        <UTextarea
          ref="userInput"
          v-model="note"
          placeholder="Type your note or use voice recording..."
          class="w-full"
          :rows="10"
          :maxrows="20"
          :disabled="loading || isRecording"
          autoresize
          size="xl"
          @keydown.enter.exact.prevent="saveNote"
          @keydown.enter.shift.exact.prevent="note += '\n'"
        />

        <!-- Recent recordings list -->
        <!-- <div v-if="recentRecordings.length > 0" class="space-y-4">
          <h3 class="font-semibold text-lg">Recent Recordings</h3>
          <ul class="space-y-2">
            <li
              v-for="recording in recentRecordings"
              :key="recording.id"
              class="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg"
            >
              <UButton
                icon="i-heroicons-play"
                color="gray"
                variant="ghost"
                size="sm"
                @click="playRecording(recording)"
              />
              <span class="flex-grow text-sm text-gray-600">{{
                recording.duration
              }}</span>
              <UButton
                icon="i-heroicons-trash"
                color="red"
                variant="ghost"
                size="sm"
                @click="deleteRecording(recording)"
              />
            </li>
          </ul>
        </div> -->

        <!-- Action buttons -->
        <div class="flex justify-end space-x-4">
          <UButton
            v-if="note.trim()"
            icon="i-heroicons-trash"
            color="gray"
            variant="ghost"
            :disabled="loading"
            @click="clearNote"
          >
            Clear
          </UButton>
          <UButton
            icon="i-heroicons-arrow-up-20-solid"
            type="submit"
            :loading="loading"
            :disabled="!note.trim() && !isRecording"
          >
            Save
          </UButton>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
type Recording = { id: number; duration: string };

const note = ref('');
const loading = ref(false);
const isRecording = ref(false);
const isTranscribing = ref(false);
const recordingDuration = ref(0);
const recentRecordings = ref<Recording[]>([]);
const recordingInterval = ref<NodeJS.Timeout | null>(null);

const visualizer = ref<HTMLCanvasElement | null>(null);
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let animationFrame: number | null = null;

const initializeAudioVisualization = (stream: MediaStream) => {
  console.log('Initializing audio visualization...');
  if (!visualizer.value) return null;

  console.log('we have the visualizer');
  audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const canvas = visualizer.value;
  const canvasCtx = canvas.getContext('2d');
  if (!canvasCtx) return null;
  console.log('Audio visualization initialized');

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const draw = () => {
    if (!isRecording.value || !analyser || !canvas || !canvasCtx) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      return;
    }

    animationFrame = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = (width / bufferLength) * 2.5;

    canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    canvasCtx.fillRect(0, 0, width, height);

    let x = 0;
    console.log('drwaing the ting !!!');
    for (let i = 0; i < bufferLength; i++) {
      const barHeight = ((dataArray[i] ?? 0) / 255) * height;

      // Create gradient effect based on amplitude
      const gradient = canvasCtx.createLinearGradient(
        0,
        height,
        0,
        height - barHeight
      );
      gradient.addColorStop(0, '#3B82F6'); // Blue-500
      gradient.addColorStop(1, '#60A5FA'); // Blue-400

      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth + 1;
    }
  };

  return draw;
};

watch(visualizer, (canvas) => {
  if (canvas && isRecording.value && !animationFrame) {
    // If we have a canvas and we're recording but visualization hasn't started
    const drawVisualizer = initializeAudioVisualization(currentStream.value!);
    if (drawVisualizer) {
      drawVisualizer();
    }
  }
});

// Mock MediaRecorder for demonstration
let mediaRecorder: MediaRecorder | null = null;
const currentStream = ref<MediaStream | null>(null);
const toggleRecording = async () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      currentStream.value = stream;

      // Initialize audio chunks array
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = async (e) => {
        audioChunks.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        // Only start transcription after recording is complete
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        isTranscribing.value = true;
        await transcribeAudio(audioBlob);
        isTranscribing.value = false;
      };

      isRecording.value = true;

      // const drawVisualizer = initializeAudioVisualization(stream);
      // if (drawVisualizer) {
      //   drawVisualizer(); // Start the animation loop
      // } else {
      //   console.error('Failed to initialize audio visualizer');
      //   useToast().add({
      //     title: 'Warning',
      //     description: 'Audio visualizer could not be initialized',
      //     color: 'yellow',
      //   });
      // }

      mediaRecorder.start(100); // Collect data every 100ms
      recordingInterval.value = setInterval(() => {
        recordingDuration.value += 1;
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      useToast().add({
        title: 'Error',
        description: 'Could not access microphone. Please check permissions.',
        color: 'red',
      });
    }
  }
};

const transcribeAudio = async (audioBlob: Blob) => {
  // Implement actual transcription here
  console.log('Transcribing audio...', audioBlob);
  await mockTranscription();
};

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    if (recordingInterval.value) {
      clearInterval(recordingInterval.value);
    }
    isRecording.value = false;

    // Add to recent recordings
    recentRecordings.value.unshift({
      id: Date.now(),
      duration: formatDuration(recordingDuration.value),
    });
    recordingDuration.value = 0;
  }
};

const mockTranscription = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  note.value += note.value ? '\n\n' : '';
  note.value += '[Transcribed text would appear here]';
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const clearNote = () => {
  note.value = '';
};

const saveNote = async () => {
  if (!note.value.trim() && !isRecording.value) return;

  loading.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    useToast().add({
      title: 'Success',
      description: 'Note saved successfully',
      color: 'green',
    });
    note.value = '';
    recentRecordings.value = [];
  } catch (err) {
    console.error('Error saving note:', err);
    useToast().add({
      title: 'Error',
      description: 'Failed to save note',
      color: 'red',
    });
  } finally {
    loading.value = false;
  }
};

// const playRecording = (recording: Recording) => {
//   console.log('Playing recording:', recording);
// };

// const deleteRecording = (recording: Recording) => {
//   recentRecordings.value = recentRecordings.value.filter(
//     (r) => r.id !== recording.id
//   );
// };

// Clean up on component unmount
onUnmounted(() => {
  if (isRecording.value) {
    stopRecording();
  }
  if (audioContext) {
    audioContext.close();
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
  if (currentStream.value) {
    currentStream.value.getTracks().forEach((track) => track.stop());
    currentStream.value = null;
  }
});
</script>
