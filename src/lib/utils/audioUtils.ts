/* eslint-disable @typescript-eslint/no-explicit-any */
export function createAudioBuffer(
  audioContext: {
    createBuffer: (arg0: number, arg1: number, arg2: number) => any;
  },
  data: any,
  sampleRate = 24000
) {
  const audioDataView = new Int16Array(data);
  if (audioDataView.length === 0) {
    console.error("Received audio data is empty.");
    return;
  }

  const buffer = audioContext.createBuffer(1, audioDataView.length, sampleRate);
  const channelData = buffer.getChannelData(0);

  for (let i = 0; i < audioDataView.length; i++) {
    channelData[i] = audioDataView[i] / 32768;
  }

  return buffer;
}

export function playAudioBuffer(
  audioContext: {
    createBufferSource: () => any;
    destination: any;
    currentTime: any;
  },
  buffer: { duration: any },
  startTimeRef: { current: number },
  analyzer: { connect: (arg0: any) => void }
) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);

  const currentTime = audioContext.currentTime;
  if (startTimeRef.current < currentTime) {
    startTimeRef.current = currentTime;
  }

  source.start(startTimeRef.current);
  startTimeRef.current += buffer.duration;

  return source;
}

export function downsample(
  buffer: string | any[],
  fromSampleRate: number,
  toSampleRate: number
) {
  if (fromSampleRate === toSampleRate) {
    return buffer;
  }
  const sampleRateRatio = fromSampleRate / toSampleRate;
  const newLength = Math.round(buffer.length / sampleRateRatio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;
  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
    let accum = 0,
      count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = accum / count;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

export function convertFloat32ToInt16(buffer: string | any[]) {
  let l = buffer.length;
  const buf = new Int16Array(l);
  while (l--) {
    buf[l] = Math.min(1, buffer[l]) * 0x7fff;
  }
  return buf.buffer;
}

export const normalizeVolume = (
  analyzer: { getByteFrequencyData: (arg0: any) => void },
  dataArray: any[],
  normalizationFactor: number
) => {
  analyzer.getByteFrequencyData(dataArray);
  const sum = dataArray.reduce((acc, val) => acc + val, 0);
  const average = sum / dataArray.length;
  return Math.min(average / normalizationFactor, 1);
};
