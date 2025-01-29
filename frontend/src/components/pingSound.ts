export async function playPing() {
  const audio = new Audio("/sound/ping.mp3");
  await audio.play().catch((error) => {
    console.error("Error playing audio:", error);
  });
}
