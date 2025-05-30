# Cocos Creator Project

This is a project created with Cocos Creator version 2.1.3.

## Overview

This project is a basic game template created with Cocos Creator version 2.1.3. It serves as a starting point for game development and includes essential assets and a pre-configured main scene. The project features various animations, font resources, sprite assets for characters and UI components, a custom sound controller script, and a collection of sound effects and background music. The main game scene is `Lobby.fire`, which can be run to preview the basic setup.

## Screenshot

![Screenshot](https://github.com/VN-Levie/SEA-Coscos-Project/blob/main/screenshot/screenshot.png?raw=true)

## How to Get Started

1. Open the project with Cocos Creator (version 2.1.3 or compatible).
2. Run the `Lobby` scene to preview.

## Project Structure

```bash
NewProject_3/
├── README.md
├── assets/
│   ├── Animations/             # Animation files
│   │   ├── CharacterBreathingAmin.anim
│   │   ├── FadeAmin.anim
│   │   ├── FlashAmin.anim
│   │   ├── FloatAmin.anim
│   │   ├── FloatReverseAmin.anim
│   │   ├── PlayButtonAnim.anim
│   │   ├── PlayButtonAnimNew.anim
│   │   ├── QuestLight.anim
│   │   ├── RankingIconAmin.anim
│   │   ├── SelectedMenuItem.anim
│   │   ├── SettingAnim.anim
│   │   ├── SettingsAnimOverlay.anim
│   │   └── StarIconRunAmin.anim
│   ├── Fonts/                  # Font files
│   │   ├── Alata-Regular SDF.asset
│   │   ├── Alata-Regular.ttf
│   │   ├── JosefinSans-Bold SDF.asset
│   │   └── JosefinSans-Bold.ttf
│   ├── Prefabs/                # Prefab files
│   │   └── RankingItem.prefab
│   ├── RealCombat/             # Real Combat assets
│   │   └── May21/              # May 21 assets
│   ├── Research/               # Research assets
│   │   ├── Scene/
│   │   └── Script/
│   ├── Scene/                  # Game scene files
│   │   └── Lobby.fire
│   ├── Script/                 # Script files
│   │   ├── Controller/         # Controller scripts
│   │   ├── Core/               # Core scripts
│   │   ├── Enum/               # Enum definitions
│   │   └── Popup/              # Popup related scripts
│   ├── Sound/                  # Sound files
│   │   ├── bgm.mp3
│   │   ├── click.mp3
│   │   └── coin_counting.mp3
│   └── Sprites/                # Sprite assets
│       ├── Background/
│       ├── Character/
│       └── Component/
├── library/                    # Build cache
├── local/                      # Local settings
├── packages/                   # Extension packages
├── researchs/                  # Research files
│   ├── may21/                  # May 21 research
│   └── may27/                  # May 27 research
├── screenshot/                 # Screenshots
│   └── screenshot.png
├── settings/                   # Project settings
├── temp/                       # Temporary files
├── creator.d.ts
├── jsconfig.json
├── project.json
├── template-banner.png
└── template.json
```

## Version Information

* **Engine**: cocos2d-html5
* **Cocos Creator Version**: 2.1.3

---

## Git Commit Messages for Line Ending Normalization

If you see changes in `.meta` files with no actual content difference, it's usually due to end-of-line (EOL) normalization or just because the Cocos Engine touched them for some reason. This is common when switching between operating systems or editors that handle line endings differently (e.g., Windows vs. Unix/Linux).

Use one of these commit messages for clarity:

```text
chore: normalize .meta files (line ending only, no content change)

chore: no content changes, only line ending normalization in .meta files
```
