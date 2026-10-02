export function renderReferenceList(container, items, equation = false) {
  container.innerHTML = items.map(([title, description, formula]) => `
    <article class="reference-item${equation ? " equation" : ""}">
      <strong>${equation ? `(${title})` : title}</strong>
      ${description ? `<div>${description}</div>` : ""}
      ${formula ? `<div class="formula">${formula}</div>` : ""}
    </article>
  `).join("");
}
