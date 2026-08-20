# Hero AQI animations — export spec

Six animations, one per AQI band, shown in the mobile hero card (`AqiHeroLottie`).
Desktop does not use them.

## The problem with the current files

They are **too low-resolution for the card** and render visibly soft.

These `.json` files are not vector Lottie. Each is a **flipbook of full-frame JPEGs**, one
image per frame, every frame **720x405**. That is the entire resolution available.

The card is 358x321 CSS px. Filling it means:

| display | device px needed | source rows available | shortfall |
| ------- | ---------------- | --------------------- | --------- |
| 2x      | 716 x 641        | 405                   | 63% of required |
| 3x      | 1074 x 963       | 405                   | 42% of required |

`cover` therefore magnifies the artwork **1.585x** at 2x, and ~2.4x at 3x. No player setting
recovers detail that is not in the file. (The renderer itself is now verified 1:1 with device
pixels — canvas backing store measured 716x641 against 716x641 needed — so the remaining
softness is entirely source resolution.)

For reference, the older `*.lottie` files beside these hold the *same scenes* at **924x996**,
and render crisp because they are downscaled (0.775x) rather than magnified.

## What to export

- **Resolution: 1728 x 972** (16:9). Sharp on 3x phones; 1152x648 is the bare minimum and only
  covers 2x displays.
- **Same composition as now.** The character's horizontal position within the frame is what
  `AQI_HERO_LOTTIE_ALIGN_X` is tuned against. Reframing means re-tuning those six values.
- Keep the existing file names and paths so no code changes are needed.

## Critical: do not re-export in this format

At 1728x972 the pixel count goes up **5.76x**. Re-exported as a JPEG flipbook at the current
encoder settings that is roughly:

| file            | now   | projected |
| --------------- | ----- | --------- |
| good.json       | 4.5MB | ~26MB     |
| all six         | 15MB  | ~88MB     |

Unshippable for a mobile hero. Pick one of these instead, best first:

1. **Ship as video** (H.264 `.mp4` + VP9/AV1 `.webm`). These animations were converted *from*
   video in the first place, and a video codec encodes a 4-second 1728x972 loop in well under
   1MB — roughly 20-60x smaller than the flipbook *and* sharper, because the bitrate is spent
   on motion rather than re-encoding every frame independently. This needs a small code change
   (a `<video>` element in place of the Lottie player); ask and it is a short job.
2. **WebP frames** instead of JPEG inside the Lottie, typically 25-35% smaller at equal quality.
3. **Fewer frames.** Currently 49-60 frames at 15fps (3-4s). Halving the frame count halves the
   file. The background is nearly static — only the character moves.

Target: **under 1.5MB per animation**.
