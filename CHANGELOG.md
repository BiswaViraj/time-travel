# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [3.0.0] - 2026-03-28

### Breaking Changes

- `add()` no longer accepts arrays — use `addMany()` for batch operations
- Constructor no longer accepts arrays — pass a single initial value
- `undo()` and `redo()` now return `T | undefined` instead of `void`
- Return type includes property getters (`canUndo`, `canRedo`, `size`)

### Added

- `addMany(values)` — batch add multiple states
- `go(n)` — jump forward or backward by N steps
- `reset()` — return to initial value and clear history
- `canUndo` / `canRedo` — boolean getters for undo/redo availability
- `size` — getter returning `{ past, future }` counts
- `getHistory()` — read-only snapshot of full history state
- `subscribe(listener)` — opt-in reactivity, fires on state changes
- Test suite with vitest

### Changed

- Source moved from root `index.ts` to `src/index.ts`
- Build target updated to ES2020

## [2.0.5] - 2024-08-11

### Changed

- Added comments to source code
- Updated GitHub link

## [2.0.4] - 2024-08-10

### Changed

- Updated package bundle size in readme
- Added badge to readme
