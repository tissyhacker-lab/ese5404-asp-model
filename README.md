# ESE5404 Activated Sludge Models

This project separates the COD- and BOD-based activated sludge calculations from the browser interface. The source is intentionally dependency-free: it uses standard JavaScript modules, HTML, CSS and SVG.

## Project structure

```text
ese5404-asp-model/
├── index.html                    Page structure only
├── css/
│   ├── layout.css               Page layout, typography and responsive rules
│   ├── controls.css             Parameter controls
│   └── diagrams.css             Charts, SVG process maps and dark mode
├── js/
│   ├── app.js                   Browser event wiring and result presentation
│   ├── models/
│   │   ├── cod-model.js         Pure COD calculations
│   │   ├── bod-model.js         Pure BOD calculations
│   │   └── parameters.js        Defaults and influent presets
│   ├── equations/
│   │   ├── cod-equations.js     COD concept and equation metadata
│   │   └── bod-equations.js     BOD concept and equation metadata
│   └── views/
│       ├── cod-charts.js         COD stacked charts
│       ├── bod-charts.js         BOD process and MCRT charts
│       ├── process-diagrams.js   COD process map and zoom/pan
│       └── reference-view.js     Reusable reference-page renderer
└── tests/
    ├── cod-model.test.js
    └── bod-model.test.js
```

## Run locally

JavaScript modules should be served over HTTP rather than opened directly with `file://`.

```powershell
cd "D:\National University of SG\Courses\Sem1 AY2026-2027 ESE5404 Biological Treatment Processes\ese5404-asp-model"
python -m http.server 8080
```

Open `http://localhost:8080/`.

## Run tests

```powershell
npm test
```

The model tests do not require a browser. They import the pure calculation functions directly.

## Reading order

1. Start with `js/models/parameters.js` to see all inputs and defaults.
2. Read `js/models/cod-model.js` and `js/models/bod-model.js` without looking at the UI.
3. Run the tests and change one parameter at a time.
4. Read `js/app.js` to see how inputs and outputs are connected.
5. Read `js/views/` to understand how SVG and charts are generated.

## Modelling note

The BOD model uses the course-level approximation that active biomass `X` can be represented by MLVSS. The COD model separates organic sludge into active biomass `Xa`, endogenous residue `Xe`, and influent inert organic solids `Xi`. These assumptions are documented in the reference pages and should be revisited before using the model for plant design or a calibrated digital twin.
