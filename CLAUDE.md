# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm start          # Start Expo dev server (scan QR with Expo Go)
npm run android    # Start with Android emulator
npm run ios        # Start with iOS simulator
npm run web        # Start for browser
npm run lint       # Run ESLint via expo lint
```

No test runner is configured yet.

## Architecture

This is an **Expo SDK 54** app using **Expo Router v6** (file-system routing) with the **New Architecture** enabled and the React Compiler experiment turned on.

### Routing

All screens live under `app/`. Expo Router maps the file tree to routes:
- `app/_layout.tsx` — root Stack navigator (currently bare `<Stack />`)
- `app/index.tsx` — the `/` route (home screen, currently a placeholder)

Add new screens as files inside `app/`. Nested navigators go in sub-directories with their own `_layout.tsx`.

### Key configuration

- `app.json` — Expo config: `scheme: "app"`, portrait orientation, adaptive Android icon, static web output, typed routes enabled
- `newArchEnabled: true` — Fabric/TurboModules are active; avoid libraries that don't support the New Architecture
- `web.output: "static"` — web build generates static HTML

### Dependencies worth noting

- `react-native-reanimated ~4.x` + `react-native-gesture-handler ~2.28` — animation/gesture stack
- `@expo/vector-icons ^15` — icon library
- `expo-haptics`, `expo-image`, `expo-symbols` — available but not yet wired up

### `app-example/`

This directory is the original Expo template backup (tabs layout, themed components, etc.). It is **not part of the live app** — use it only as reference when building out new UI patterns.
