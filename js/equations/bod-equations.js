export const BOD_CONCEPTS = [
  ["MCRT, θ<sub>c</sub>", "Average time biomass remains in the system; controlled by solids wasting.", "total biomass / biomass withdrawal rate"],
  ["HRT, θ", "Average water residence time in the aeration tank.", "θ = V/Q"],
  ["Active biomass, X", "Simplified BOD models often approximate X by MLVSS; COD models separate active and inactive VSS.", "X ≈ MLVSS is a modelling assumption"],
  ["Specific substrate utilization, q", "Absolute substrate consumption rate per unit active biomass.", "q=(1/X)(dS/dt)<sub>u</sub>"],
  ["Monod kinetics", "Gross growth approaches μ<sub>m</sub>; net growth subtracts endogenous decay K<sub>d</sub>.", "net growth = μ<sub>m</sub>SX/(K<sub>s</sub>+S) - K<sub>d</sub>X"],
  ["Washout boundary", "Below the critical MCRT, sustained biomass cannot be maintained.", "θ<sub>c,w</sub>=1/[μ<sub>m</sub>S<sub>o</sub>/(K<sub>s</sub>+S<sub>o</sub>)-K<sub>d</sub>]"],
  ["RAS and recycle ratio", "The clarifier returns concentrated solids and decouples MCRT from HRT.", "R=Q<sub>r</sub>/Q"],
  ["Excess sludge", "Daily biomass withdrawal required to maintain the selected MCRT.", "P<sub>X</sub>=VX/θ<sub>c</sub>"],
  ["Oxygen demand", "Ultimate BOD removal minus the oxygen equivalent exported in biomass.", "carbonaceous O₂ + nitrogenous O₂"],
  ["SVI and X<sub>r,max</sub>", "Settleability constrains the maximum return-sludge concentration.", "higher SVI → lower X<sub>r,max</sub>" ]
];

export const BOD_EQUATIONS = [
  ["1-2", "θ<sub>c</sub>=XV/[Q<sub>w</sub>X<sub>r</sub>+(Q-Q<sub>w</sub>)X<sub>e</sub>]"],
  ["3-6", "At steady state: biomass appearing = biomass lost = XV/θ<sub>c</sub>"],
  ["7-8", "1/θ<sub>c</sub>=Y<sub>T</sub>q-K<sub>d</sub>"],
  ["9-11", "S=K<sub>s</sub>(1+K<sub>d</sub>θ<sub>c</sub>)/[θ<sub>c</sub>(μ<sub>m</sub>-K<sub>d</sub>)-1]"],
  ["12-14", "q=(S<sub>o</sub>-S)/(θX); X=Y<sub>T</sub>(S<sub>o</sub>-S)θ<sub>c</sub>/[(1+K<sub>d</sub>θ<sub>c</sub>)θ]"],
  ["15-16", "θ<sub>c</sub>=θ/[1+R-R(X<sub>r</sub>/X)]"],
  ["17-18", "SVI=V/(V<sub>o</sub>X); (X<sub>r</sub>/γ<sub>v</sub>)<sub>max</sub>=10⁶/SVI"],
  ["19", "P<sub>X</sub>=VX/θ<sub>c</sub>"],
  ["20", "Biomass oxygen equivalent = 1.42 g O₂/g VSS"],
  ["21-22", "O₂=Q(S<sub>o</sub><sup>u</sup>-S<sup>u</sup>)-1.42P<sub>X</sub>"],
  ["23-24", "NOD=4.57Q(TKN<sub>o</sub>)"],
  ["25-26", "F/M=QS<sub>o</sub>/(VX)=S<sub>o</sub>/(θX); 1/θ<sub>c</sub>≈Y<sub>T</sub>(F/M)-K<sub>d</sub>" ]
];
