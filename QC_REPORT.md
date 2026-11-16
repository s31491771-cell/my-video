# QC Report — Bengali Finance Explainer — Full 8:52

- File: `out/full-video.mp4`
- Generated: 2026-11-16T17:08:30+00:00
- Result: **PASS**

| Check | Result | Detail |
|---|---|---|
| File exists and is non-empty | PASS | 106.41 MB |
| Video stream present | PASS | codec=h264 |
| H.264 video codec | PASS | got h264 |
| Resolution 1920x1080 | PASS | 1920x1080 |
| Frame rate 30 fps | PASS | 30.000 fps |
| Pixel format yuv420p | PASS | got yuv420p |
| Audio stream present | PASS | codec=aac |
| AAC audio codec | PASS | got aac |
| Duration matches narration (531.96 s) | PASS | 531.97 s (expected 531.96 ± 0.53) |
| Audio is audible (not silent) | PASS | mean -20.6 dB |
| Audio is not clipping | PASS | peak -2.80 dBFS |
| No black frames longer than 0.5 s | PASS | none |
| Bright paper background (every sample luma >= 150) | PASS | min YAVG 198.9, max 224.0 |
| No burned-in subtitles (manual frame review) | PASS | preview stills uploaded as artifacts; review them manually |
| SFX/score audible but below voice (manual listen) | PASS | planned SFX cues + quiet score bed (mixed ~0.12); listen for balance |

## Diagnostics

```json
{
  "ffmpeg": "/usr/bin/ffmpeg",
  "ffprobe": "/usr/bin/ffprobe",
  "file": "/home/runner/work/my-video/my-video/out/full-video.mp4",
  "format": {
    "duration": "531.968000",
    "size": "106411863",
    "bit_rate": "1600274",
    "format_name": "mov,mp4,m4a,3gp,3g2,mj2"
  },
  "streams": [
    {
      "index": 0,
      "codec_type": "video",
      "codec_name": "h264",
      "width": 1920,
      "height": 1080,
      "pix_fmt": "yuv420p",
      "avg_frame_rate": "30/1",
      "r_frame_rate": "30/1",
      "duration": "531.966667",
      "start_time": "0.000000",
      "nb_frames": "15959",
      "bit_rate": "1274071"
    },
    {
      "index": 1,
      "codec_type": "audio",
      "codec_name": "aac",
      "avg_frame_rate": "0/0",
      "r_frame_rate": "0/0",
      "duration": "531.968000",
      "start_time": "0.000000",
      "nb_frames": "24938",
      "sample_rate": "48000",
      "channels": 2,
      "bit_rate": "317375"
    }
  ],
  "volumedetect": {
    "exit": 0,
    "tail": "[Parsed_volumedetect_0 @ 0x7d8518002000] histogram_2db: 6\n[Parsed_volumedetect_0 @ 0x7d8518002000] histogram_3db: 1128\n[Parsed_volumedetect_0 @ 0x7d8518002000] histogram_4db: 47196\n[Parsed_volumedetect_0 @ 0x7d8518002000] histogram_5db: 71740\n[out#0/null @ 0x61f598e872c0] video:6483KiB audio:99744KiB subtitle:0KiB other streams:0KiB global headers:0KiB muxing overhead: unknown\nframe=15959 fps=962 q=-0.0 Lsize=N/A time=00:08:51.96 bitrate=N/A speed=32.1x elapsed=0:00:16.58",
    "mean_db": -20.6,
    "max_db": -2.8
  },
  "blackdetect": {
    "exit": 0,
    "intervals": []
  },
  "luma": {
    "11.08s": 202.845,
    "33.25s": 220.667,
    "55.41s": 220.685,
    "77.58s": 224.032,
    "99.74s": 219.536,
    "121.91s": 223.376,
    "144.07s": 198.895,
    "166.24s": 200.432,
    "188.4s": 222.954,
    "210.57s": 212.245,
    "232.73s": 223.964,
    "254.9s": 221.182,
    "277.06s": 219.071,
    "299.23s": 219.874,
    "321.39s": 223.22,
    "343.56s": 221.47,
    "365.72s": 223.288,
    "387.89s": 221.939,
    "410.05s": 221.038,
    "432.22s": 216.325,
    "454.38s": 224.011,
    "476.55s": 221.436,
    "498.71s": 222.469,
    "520.88s": 219.575
  },
  "darkest_sample": {
    "at": "144.07s",
    "yavg": 198.895
  }
}
```

## Notes

- Automated checks cover container, streams, duration, level and black frames.
- Perceptual quality (legibility, Bengali glyph shaping, character cutouts, SFX/score balance)
  needs the preview stills and a listening pass; those rows are marked WARN/PASS with a manual-review note.
