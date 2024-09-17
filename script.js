const regions = WaveSurfer.Regions.create();

const ws = WaveSurfer.create({
  container: '#waveform',
  waveColor: '#4F4A85',
  progressColor: '#383351',
  url: '/audio.m4a',
  mediaControls: true,
  normalize: true,
  audioRate: 1,
  plugins: [regions],
});

ws.once('decode', () => {
  // PlayPause on keydown spacebar
  document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
      ws.playPause();
    }
  });

  // Zoom
  const zoomRange = document.querySelector('#zoom-range');
  zoomRange.addEventListener('input', (e) => {
    const minPxPerSec = e.target.valueAsNumber;
    ws.zoom(minPxPerSec);
  });

  // Pitch preservation
  let preservePitch = true;
  document
    .querySelector('input[type="checkbox"]')
    .addEventListener('change', (e) => {
      preservePitch = e.target.checked;
      ws.setPlaybackRate(ws.getPlaybackRate(), preservePitch);
    });

  // Set the playback rate
  const speeds = [0.25, 0.5, 0.75, 1];

  const pitchRangeInput = document.querySelector('#pitch-range');
  pitchRangeInput.value = 3;
  pitchRangeInput.addEventListener('input', (e) => {
    const speed = speeds[e.target.valueAsNumber];
    document.querySelector('#rate').textContent = speed.toFixed(2);
    ws.setPlaybackRate(speed, preservePitch);
    ws.play();
  });

  // Regions
  {
    regions.enableDragSelection({
      color: 'rgba(255, 0, 0, 0.1)',
    });

    regions.on('region-clicked', (region, e) => {
      e.stopPropagation(); // prevent triggering a click on the waveform
      activeRegion = region;
      region.play();
    });

    let activeRegion = null;
    regions.on('region-in', (region) => {
      console.log('region-in', region);
      activeRegion = region;
    });

    regions.on('region-out', (region) => {
      console.log('region-out', region);
      if (activeRegion === region) {
        ws.pause();
        activeRegion = null;
      }
    });
  }
});
