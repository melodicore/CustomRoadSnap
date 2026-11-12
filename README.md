# Custom Road Snap Fork — Cities: Skylines II Mod

![Version](https://img.shields.io/badge/release-not%20yet%20released-lightgrey)
![Game Version](https://img.shields.io/badge/game%20version-1.5.*-green)

> **This is a fork.** Custom Road Snap Fork is based on
> [CustomRoadSnap](https://github.com/Rias1944/CustomRoadSnap) by **Rias**
> ([Rias1944](https://github.com/Rias1944)), the original author, who created the mod and
> its snapping implementation. The original is also available on
> [Paradox Mods](https://mods.paradoxplaza.com/mods/141606/Windows). See
> [Attribution](#attribution) below.

A mod for **Cities: Skylines II** that snaps roads to a **configurable angle** while the Net Tool is active.

### ⚠️ Experimental Mod
This mod is currently in experimental stage. Bugs may occur during gameplay. 
Please test the mod on a test save before using it on your main city to avoid 
potential save corruption or unexpected behavior.

## Features

- Configure the snap angle (1–90°) via a **slider in mod settings**
- Default: 30° (gives axes at 0°, 30°, 60°, 90°, … — ideal for hex-grid cities)
- Toggle button in the **Tool Options** panel when the road tool is active: it switches the vanilla 90° snap over to your custom angle. The vanilla snap button stays the master switch, so turning it off disables all angle snapping
- Keyboard shortcut to toggle snapping on/off (configurable in mod settings)
- Minimal performance impact — only active when the Net Tool is selected

## Changes in this fork

- The vanilla 90° snap button is the master switch for all angle snapping. The mod's own
  button only switches between the vanilla 90° snap and the custom angle, so snapping can
  now be turned off completely
- Quick angle slider next to the toggle button in the road tool options
- Builds on Linux (see [Building from Source](#building-from-source))

## Todo-List

- [ ] Add Localization
- [x] Add UI slider next to the Button in the Road tools to quickly edit angles

## 📦 Installation

**This fork has not been released yet.** There is no Paradox Mods page or release download
for it, so for now the only way to use it is to [build it from source](#building-from-source)
and copy the result to:

`%AppData%\..\LocalLow\Colossal Order\Cities Skylines II\Mods\CustomRoadSnapFork\`

Then enable the mod in the **Options → Mods** menu in-game.

The original mod on Paradox Mods does not include this fork's changes. It is a separate mod with its own
mod ID, so both can be installed, but only run one of them at a time, as they patch the same
road tool.

## Building from Source

### Prerequisites
- Visual Studio 2022+ with .NET Framework 4.8
- Node.js 18+
- Cities: Skylines II installed (game DLLs referenced via `Library/`)

### Steps

```bash
# Install UI dependencies
cd ui
npm install

# Build UI
npm run build

# Build C# project
# Open CustomRoadSnapFork.slnx in Visual Studio and build
```

On Linux, set up the modding toolchain as described on the
[CS2 modding wiki](https://cs2.paradoxwikis.com/Modding_Toolchain_on_Linux) and run
`dotnet build -c Release`.

## How It Works

The mod uses **HarmonyX** to patch the game's road placement system:

- `CustomRoadSnapPreSystem` removes the vanilla 90° snap flag before `NetToolSystem` runs
- `CustomRoadSnapPostSystem` computes snap axes from your configured angle and injects guide lines
- A Harmony postfix on `GetRaycastResult` snaps the cursor position to the nearest axis
- The snap angle is read dynamically every frame — changing it in settings takes effect immediately

The UI button is injected into CS2's `MouseToolOptions` panel using the official CS2 modding `moduleRegistry.extend` pattern.

## Attribution

Custom Road Snap Fork is a fork of [CustomRoadSnap](https://github.com/Rias1944/CustomRoadSnap)
by **Rias**. The original idea, the snapping implementation and the UI integration are the
original author's work; this fork builds on them. Thank you!

The fork is maintained by [MELOD](https://github.com/melodicore).

## License

GNU GPLv3, the same license as the original project.
