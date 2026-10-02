const fraction = (numerator, denominator) => `
  <span class="fraction">
    <span class="numerator">${numerator}</span>
    <span class="denominator">${denominator}</span>
  </span>`;

const derivative = fraction("dS", "dt");
const utilizationRate = `(${derivative})<sub>u</sub>`;

export const BOD_REFERENCE_GROUPS = [
  {
    title: "MCRT, θ<sub>c</sub>",
    definition: "Average time that a unit of biomass remains in the treatment system; controlled by solids wasting.",
    relations: [
      {
        id: "1",
        type: "Definition",
        formula: `θ<sub>c</sub> = ${fraction("total biomass in the system", "rate of biomass withdrawal from the system")}`
      },
      {
        id: "2",
        type: "Calculation from solids inventory and losses",
        formula: `θ<sub>c</sub> = ${fraction("XV", "Q<sub>w</sub>X<sub>r</sub> + (Q − Q<sub>w</sub>)X<sub>e</sub>")}`
      }
    ]
  },
  {
    title: "Biomass growth and specific substrate utilization, q",
    definition: "At steady state, biomass appearance equals biomass loss. The utilization rate q is substrate consumed per unit active biomass.",
    relations: [
      { id: "3", type: "Steady-state condition", formula: "Rate of biomass appearance = Rate of biomass loss" },
      {
        id: "4",
        type: "Biomass production equals biomass leaving",
        formula: `[Y<sub>T</sub>${utilizationRate} − K<sub>d</sub>X]V = Q<sub>w</sub>X<sub>r</sub> + (Q − Q<sub>w</sub>)X<sub>e</sub>`
      },
      {
        id: "5",
        type: "Biomass withdrawal from the MCRT definition",
        formula: `Q<sub>w</sub>X<sub>r</sub> + (Q − Q<sub>w</sub>)X<sub>e</sub> = ${fraction("XV", "θ<sub>c</sub>")}`
      },
      {
        id: "6",
        type: "Growth-loss balance",
        formula: `[Y<sub>T</sub>${utilizationRate} − K<sub>d</sub>X]V = ${fraction("XV", "θ<sub>c</sub>")}`
      },
      {
        id: "7",
        type: "MCRT relationship",
        formula: `${fraction("1", "θ<sub>c</sub>")} = Y<sub>T</sub>[${fraction("1", "X")}${utilizationRate}] − K<sub>d</sub>`
      },
      {
        id: "8",
        type: "Using q",
        formula: `${fraction("1", "θ<sub>c</sub>")} = Y<sub>T</sub>q − K<sub>d</sub>`
      }
    ]
  },
  {
    title: "Effluent substrate, S, and active biomass, X",
    definition: "Monod growth and the substrate balance connect the selected MCRT and HRT to effluent substrate and aeration-tank biomass.",
    relations: [
      {
        id: "9",
        type: "Total biomass withdrawal",
        formula: `Biomass withdrawal = [${fraction("μ<sub>m</sub>SX", "K<sub>s</sub> + S")} − K<sub>d</sub>X]V`
      },
      {
        id: "10",
        type: "MCRT from Monod kinetics",
        formula: `θ<sub>c</sub> = ${fraction("XV", `[${fraction("μ<sub>m</sub>SX", "K<sub>s</sub> + S")} − K<sub>d</sub>X]V`)} = ${fraction("K<sub>s</sub> + S", "μ<sub>m</sub>S − K<sub>d</sub>(K<sub>s</sub> + S)")}`
      },
      {
        id: "11",
        type: "Effluent substrate calculation",
        formula: `S = ${fraction("K<sub>s</sub>(1 + K<sub>d</sub>θ<sub>c</sub>)", "θ<sub>c</sub>(μ<sub>m</sub> − K<sub>d</sub>) − 1")}`
      },
      {
        id: "12",
        type: "Steady-state substrate removal rate",
        formula: `${utilizationRate} = ${fraction("Q(S<sub>o</sub> − S)", "V")} = ${fraction("S<sub>o</sub> − S", "θ")}`
      },
      {
        id: "13",
        type: "Specific substrate utilization",
        formula: `q = ${fraction("S<sub>o</sub> − S", "θX")}`
      },
      {
        id: "14",
        type: "Aeration-tank biomass calculation",
        formula: `X = ${fraction("Y<sub>T</sub>(S<sub>o</sub> − S)θ<sub>c</sub>", "(1 + K<sub>d</sub>θ<sub>c</sub>)θ")}`
      }
    ]
  },
  {
    title: "RAS, recycle ratio, and MCRT-HRT decoupling",
    definition: `The secondary clarifier concentrates and returns solids. The recycle ratio is R = ${fraction("Q<sub>r</sub>", "Q")}.`,
    relations: [
      {
        id: "15",
        type: "Clarifier biomass balance",
        formula: `Q(1 + R)X = (Q − Q<sub>w</sub>)X<sub>e</sub> + Q<sub>w</sub>X<sub>r</sub> + RQX<sub>r</sub>`
      },
      {
        id: "16",
        type: "MCRT-HRT-recycle relationship",
        formula: `θ<sub>c</sub> = ${fraction("XV", "Q(1 + R)X − RQX<sub>r</sub>")} = ${fraction("θ", `1 + R − R${fraction("X<sub>r</sub>", "X")}`)}`
      }
    ]
  },
  {
    title: "Sludge Volume Index and return-sludge concentration",
    definition: "SVI is an empirical settleability index. Poorer settling limits the solids concentration achievable in the return line.",
    relations: [
      {
        id: "17",
        type: "SVI definition",
        formula: `SVI = ${fraction("V", "V<sub>o</sub>X")}`
      },
      {
        id: "18",
        type: "Maximum volatile solids in RAS",
        formula: `(${fraction("X<sub>r</sub>", "γ<sub>v</sub>")})<sub>max</sub> = ${fraction("10<sup>6</sup>", "SVI")}`
      }
    ]
  },
  {
    title: "Excess sludge production, P<sub>X</sub>",
    definition: "Daily biomass withdrawal required to maintain the selected MCRT.",
    relations: [
      {
        id: "19",
        type: "Excess-sludge mass rate",
        formula: `P<sub>X</sub> = ${fraction("total biomass in the aeration tank", "θ<sub>c</sub>")} = ${fraction("VX", "θ<sub>c</sub>")}`
      }
    ]
  },
  {
    title: "Carbonaceous oxygen requirement",
    definition: "Oxygen demand equals ultimate BOD removed minus the oxygen equivalent retained in wasted biomass.",
    relations: [
      {
        id: "20",
        type: "Biomass oxygen equivalent",
        formula: `C<sub>5</sub>H<sub>7</sub>O<sub>2</sub>N + 5O<sub>2</sub> → 5CO<sub>2</sub> + 2H<sub>2</sub>O + NH<sub>3</sub>; ${fraction("5(32)", "113")} = 1.42`
      },
      {
        id: "21",
        type: "Daily carbonaceous oxygen demand",
        formula: `O<sub>2</sub> = Q(S<sub>o</sub><sup>u</sup> − S<sup>u</sup>) − 1.42P<sub>X</sub>`
      },
      {
        id: "22",
        type: "Five-day BOD to ultimate BOD",
        formula: `S<sub>o</sub><sup>u</sup> = ${fraction("S<sub>o</sub><sup>5</sup>", "1 − e<sup>−5K</sup>")}`
      }
    ]
  },
  {
    title: "Nitrogenous oxygen requirement, NOD",
    definition: "Complete nitrification requires 4.57 kg O₂ per kg of ammonia nitrogen oxidized.",
    relations: [
      {
        id: "23",
        type: "Nitrification stoichiometry",
        formula: "NH<sub>4</sub><sup>+</sup> + 2O<sub>2</sub> → NO<sub>3</sub><sup>−</sup> + 2H<sup>+</sup> + H<sub>2</sub>O"
      },
      {
        id: "24",
        type: "Conservative NOD estimate",
        formula: "NOD = 4.57Q(TKN<sub>o</sub>)"
      }
    ]
  },
  {
    title: "Food-to-microorganism ratio and MCRT",
    definition: "F/M describes the applied substrate load per unit biomass inventory and is inversely related to MCRT.",
    relations: [
      {
        id: "25",
        type: "F/M definition and calculation",
        formula: `${fraction("F", "M")} = ${fraction("QS<sub>o</sub>", "VX")} = ${fraction("S<sub>o</sub>", "θX")}`
      },
      {
        id: "26",
        type: "Approximate F/M-MCRT relationship",
        formula: `${fraction("1", "θ<sub>c</sub>")} ≈ Y<sub>T</sub>(${fraction("F", "M")}) − K<sub>d</sub>`
      }
    ]
  }
];
