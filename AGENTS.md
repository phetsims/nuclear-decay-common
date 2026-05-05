# Instructions for `nuclear-decay-common`

## Build, lint, and test commands

- This package lives inside the PhET `totality` monorepo. Run repo-level commands from the monorepo root: `C:\Users\john\totality`.
- `npm run check` — primary verification command. It runs linting, type checking, and the relevant tests for the current working changes.
- `npm run use -- nuclear-decay-common` — select this package as the current project for directory-specific Grunt tasks.
- `npm run grunt -- --help` — list Grunt tasks available for the currently selected project.
- `npm run grunt -- modulify` — regenerate generated module/string outputs after editing sources such as `nuclear-decay-common-strings_en.yaml`.
- There are no package-local test files in this directory, so there is no package-local single-test command. Focused runtime verification usually happens through a consuming sim such as `alpha-decay` or `beta-decay`.

## High-level architecture

- `nuclear-decay-common` is a shared library for `alpha-decay`, `beta-decay`, and `radioactive-dating-game`; it is not a standalone sim bootstrap.
- As of May 5, 2026, this is a new and rapidly evolving shared library for the Nuclear Decay Suite (`alpha-decay`, `beta-decay`, and `radioactive-dating-game`). Expect some APIs and structure to keep moving in the near term, with stabilization expected over the following several months.
- `js/common/model/NuclearDecayModel.ts` is the core model base. It owns isotope selection, half-life calculation, time progression, atom pools (`atomPool`, `activeAtoms`, `undecayedAtoms`, `decayedAtoms`), and `HistogramData`.
- Screen-specific model folders (`js/single-atom/model`, `js/multiple-atoms/model`, `js/decay-rate/model`) extend the common base rather than duplicating decay logic.
- `js/common/view/NuclearDecayScreenView.ts` is the shared screen-view base. It manages atom-node pooling, the model-view transform, play-area bounds, and per-frame updates/sound hooks.
- Screen-specific view folders (`js/single-atom/view`, `js/multiple-atoms/view`, `js/decay-rate/view`) compose common panels from `js/common/view` on top of the shared base view.
- `js/NuclearDecayCommonConstants.ts` and `js/NuclearDecayCommonColors.ts` are the shared source of truth for styling, layout spacing, isotope constants, and other cross-screen configuration.
- Strings are sourced from `nuclear-decay-common-strings_en.yaml` and exposed through generated files such as `js/NuclearDecayCommonStrings.ts` and `js/NuclearDecayCommonFluent.ts`.

## Key conventions

- Follow the PhET `optionize` pattern for constructors (`SelfOptions` + parent options types) instead of ad hoc option merging.
- Model classes are typically instrumented for PhET-iO. `NuclearDecayModel` extends `PhetioObject`, and new public Properties/Nodes usually get tandems from `options.tandem.createTandem(...)`.
- Keep shared code consumer-agnostic. This package is imported by other sims via monorepo-relative paths, so avoid assumptions that only make sense in a single sim.
- Treat `nuclear-decay-common-strings_en.yaml` as the string source of truth. Do not hand-edit generated outputs such as `nuclear-decay-common-strings_en.json`, `js/NuclearDecayCommonStrings.ts`, or `js/NuclearDecayCommonFluent.ts`.
- All user-visible text, including accessibility text, should flow through the string system. The existing YAML already includes visual strings and a11y strings; extend that instead of hardcoding labels.
- When a `DerivedProperty`, `Multilink`, or callback reads a Property or StringProperty, include that Property in the dependency list so updates stay synchronized (especially for locale-sensitive content).
- Reuse `NuclearDecayCommonConstants` and `NuclearDecayCommonColors` for layout and styling before introducing new dimensions or colors in individual panels.
- `DecayTimeHistogramPanel.update(...)` rebuilds `dataPointsLayer` with `removeAllChildren()` on each update, so changes in that path should be reviewed with allocation/performance in mind.
