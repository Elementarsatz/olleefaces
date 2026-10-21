# Metronome Supreme

## Intro

This metronome face for the Ollee Watch is based on Gregor's example in [Forge Emulator rep](https://github.com/olleewatch/forge_emulator/tree/main). This new approach includes time subdivisions and time signature indicators.

## How to make it do what it does

As in the example, it uses long hold of buttons L and A. It now has

| Input | Event |
| ----- | ----- |
| short L | bpm mode: increases by 1, option mode: changes time signature |
| short A | bpm mode: decreases by 1, option mode: changes subdivision |
| long L | bpm mode: increases faster, option mode: - |
| long A | bpm mode: decreases faster, option mode: -  |
| L + A | toggles option mode/bpm mode |
| Triple tap | toggles on/off |

enjoy.
