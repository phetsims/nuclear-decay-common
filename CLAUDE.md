# CLAUDE.md — nuclear-decay-common

Shared code library for **Alpha Decay**, **Beta Decay**, and **Radioactive Dating Game** simulations.

## Architecture

### Model (`js/model/`)

| Class | Role |
|-------|------|
| `NuclearDecayModel` | Base model for all nuclear decay sims. Manages nucleus state, isotope selection, decay calculations, and atom lifecycle. |
| `NuclearDecayAtom` | A single decaying atom with decay status, timing, and pre/post-decay atomic configuration. |
| `Isotope` | Represents a specific isotope; manages proton/neutron counts, mass number, half-life as Properties. |
| `HistogramData` | Bins decay events by time for histogram visualization. |
| `DecayDataPoint` | Simple data type for a graph point (decay event time in seconds). |

### Key Model Properties

- **`selectedIsotopeProperty`** — `Property<SelectableIsotopes>` where `SelectableIsotopes = 'custom' | 'polonium-211' | 'hydrogen-3' | 'carbon-14'`. Sim subclasses may restrict which values are available.
- **`selectedHalfLifeProperty`** — `NumberProperty`, auto-set from the selected isotope's known half-life. When `'custom'` is selected, this can be freely changed by the user (e.g., via a slider).
- **`timeProperty`** — Elapsed simulation time.
- **`timeSpeedProperty`** — `EnumerationProperty<TimeSpeed>` for playback speed.

### View (`js/view/`)

19 reusable view components. Key ones:

| Class | Role |
|-------|------|
| `NuclearDecayScreenView` | Common base ScreenView for all nuclear decay sims. |
| `SingleAndMultipleAtomsScreenView` | ScreenView with histogram-based decay display, isotope panels, and equations. |
| `NuclearDecayPanel` | Base Panel with common styling (corner radius, fill, margins from `NuclearDecayCommonConstants`). |
| `DecayTimeHistogramPanel` | Histogram panel: half-life timeline, time bins, decay counts, eraser button, half-life slider (custom only). |
| `DecayRateGraphPanel` | Graph panel showing isotope decay rates over time. |
| `IsotopeControlPanel` | Radio buttons for isotope selection + particles legend. |
| `AddAtomsControlPanel` | Controls for navigating isotopes and adding atoms. |
| `EquationAccordionBox` / `EquationNode` | Nuclear decay equation display (A → B + C). |
| `EnergyDiagramAccordionBox` | Alpha particle energy diagram. |
| `NuclearDecayAtomNode` / `MinimalAtomNode` | Atom visualizations (detailed nucleons vs. simple circle). |

### Shared Resources

- **Constants**: `NuclearDecayCommonConstants.ts` — fonts, max widths, panel styling.
- **Colors**: `NuclearDecayCommonColors.ts` — profile colors (undecayed, half-life, etc.).
- **Strings**: `NuclearDecayCommonFluent.ts` — i18n string access.

## Patterns

- **Custom isotope mode**: When `selectedIsotopeProperty === 'custom'`, UI elements like the half-life slider become visible, and `selectedHalfLifeProperty` is user-editable.
- **Histogram updates**: `DecayTimeHistogramPanel.update(histogramData)` rebuilds the display from `HistogramData` on each step. Watch for memory — it calls `removeAllChildren()` each frame.
- **Inheritance**: Sim-specific models extend `NuclearDecayModel`; sim-specific views extend `SingleAndMultipleAtomsScreenView` or `NuclearDecayScreenView`.

## Dependencies

- `shred` — Particle and atom model utilities.
- Standard PhET libs: `axon`, `scenery`, `scenery-phet`, `dot`, `sun`, `kite`, `tandem`, `joist`.
