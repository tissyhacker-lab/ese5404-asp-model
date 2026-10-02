export const COD_CONCEPTS = [
  ["Influent COD, S<sub>ti</sub>", "Total soluble and particulate organic matter expressed as oxygen-equivalent concentration.", "S<sub>ti</sub> = S<sub>bsi</sub> + S<sub>bpi</sub> + S<sub>nsi</sub> + S<sub>npi</sub>"],
  ["Biodegradable COD, S<sub>bi</sub>", "The fraction available for heterotrophic metabolism.", "S<sub>bi</sub> = (1 - f<sub>ns</sub> - f<sub>np</sub>)S<sub>ti</sub>"],
  ["Active sludge, X<sub>a</sub>", "Living heterotrophic biomass produced from biodegradable COD.", "X<sub>a</sub> is only one part of MLVSS."],
  ["Inactive organic sludge", "X<sub>i</sub> is influent inert particulate matter; X<sub>e</sub> is endogenous residue.", "X<sub>v</sub> = X<sub>a</sub> + X<sub>e</sub> + X<sub>i</sub>"],
  ["MLVSS and MLSS", "Organic mixed-liquor solids are approximated by Xv; total mixed-liquor solids include inorganic Xm.", "X<sub>t</sub> = X<sub>v</sub> + X<sub>m</sub> = X<sub>v</sub>/f<sub>v</sub>"],
  ["Sludge age, R<sub>s</sub>", "Average residence time of solids; governed by solids wasting.", "R<sub>s</sub> = MX<sub>t</sub>/ME<sub>t</sub>"],
  ["Hydraulic retention time, R<sub>h</sub>", "Average residence time of water in the aeration tank.", "R<sub>h</sub> = V<sub>r</sub>/Q<sub>i</sub>"],
  ["Production factor, C<sub>r</sub>", "Active-sludge inventory per unit daily biodegradable COD load.", "C<sub>r</sub> = YR<sub>s</sub>/(1+b<sub>h</sub>R<sub>s</sub>)"],
  ["COD fate fractions", "Influent COD leaves dissolved, leaves in excess sludge, or is oxidized.", "mS<sub>te</sub> + mS<sub>xv</sub> + mS<sub>o</sub> = 1"],
  ["True and observed yield", "True yield describes synthesis; observed yield also reflects decay and inert solids.", "Y<sub>ap</sub> = ME<sub>v</sub>/MS<sub>ti</sub>"],
  ["F/M ratio", "Applied COD per unit volatile-sludge inventory per day.", "F/M = MS<sub>ti</sub>/MX<sub>v</sub>" ]
];

export const COD_EQUATIONS = [
  ["C1", "S<sub>ti</sub> = S<sub>bi</sub> + S<sub>ni</sub> = S<sub>bsi</sub> + S<sub>bpi</sub> + S<sub>nsi</sub> + S<sub>npi</sub>"],
  ["C1a-C1c", "f<sub>ns</sub>=S<sub>nsi</sub>/S<sub>ti</sub>; f<sub>np</sub>=S<sub>npi</sub>/S<sub>ti</sub>; f<sub>sb</sub>=S<sub>bsi</sub>/S<sub>ti</sub>"],
  ["C2-C3", "S<sub>ni</sub>=(f<sub>ns</sub>+f<sub>np</sub>)S<sub>ti</sub>; S<sub>bi</sub>=(1-f<sub>ns</sub>-f<sub>np</sub>)S<sub>ti</sub>"],
  ["C4-C5", "X<sub>v</sub>=X<sub>a</sub>+X<sub>e</sub>+X<sub>i</sub>; X<sub>t</sub>=X<sub>v</sub>+X<sub>m</sub>=X<sub>v</sub>/f<sub>v</sub>"],
  ["C6, C14", "MS<sub>ti</sub>=MS<sub>te</sub>+MS<sub>xv</sub>+MS<sub>o</sub>; mS<sub>te</sub>+mS<sub>xv</sub>+mS<sub>o</sub>=1"],
  ["C15-C18", "R<sub>s</sub>=V<sub>r</sub>/q; R<sub>h</sub>=V<sub>r</sub>/Q<sub>i</sub>; mS<sub>te</sub>=f<sub>ns</sub>"],
  ["C21", "X<sub>i</sub>=f<sub>np</sub>R<sub>s</sub>S<sub>ti</sub>/(f<sub>cv</sub>R<sub>h</sub>)"],
  ["C29-C30", "X<sub>a</sub>=(1-f<sub>ns</sub>-f<sub>np</sub>)C<sub>r</sub>S<sub>ti</sub>/R<sub>h</sub>; C<sub>r</sub>=YR<sub>s</sub>/(1+b<sub>h</sub>R<sub>s</sub>)"],
  ["C34-C35", "X<sub>e</sub>=fb<sub>h</sub>R<sub>s</sub>X<sub>a</sub>; X<sub>v</sub>=X<sub>a</sub>+X<sub>e</sub>+X<sub>i</sub>"],
  ["C36-C38", "MX<sub>v</sub>=mX<sub>v</sub>MS<sub>ti</sub>; ME<sub>v</sub>=MX<sub>v</sub>/R<sub>s</sub>; mS<sub>xv</sub>=f<sub>cv</sub>ME<sub>v</sub>/MS<sub>ti</sub>"],
  ["C39-C43", "O<sub>ex</sub>=(1-f<sub>cv</sub>Y)r<sub>us</sub>; O<sub>en</sub>=f<sub>cv</sub>(1-f)b<sub>h</sub>X<sub>a</sub>"],
  ["C44-C45", "COD balance = 1.0; mX<sub>i</sub>=f<sub>np</sub>R<sub>s</sub>/f<sub>cv</sub>"],
  ["C52-C55", "f<sub>av</sub>=mX<sub>a</sub>/mX<sub>v</sub>; V<sub>r</sub>=MX<sub>v</sub>/X<sub>v</sub>"],
  ["C57-C60", "N<sub>l</sub>=f<sub>n</sub>mE<sub>v</sub>S<sub>ti</sub>; P<sub>l</sub>=f<sub>p</sub>mE<sub>v</sub>S<sub>ti</sub>"],
  ["C61-C63", "F/M=1/mX<sub>v</sub>; r<sub>su</sub>=(1+b<sub>h</sub>R<sub>s</sub>)/(YR<sub>s</sub>)=1/C<sub>r</sub>" ]
];
