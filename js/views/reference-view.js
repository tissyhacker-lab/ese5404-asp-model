export function renderReferenceList(container, items, equation = false) {
  container.innerHTML = items.map(([title, description, formula]) => `
    <article class="reference-item${equation ? " equation" : ""}">
      <strong>${equation ? `(${title})` : title}</strong>
      ${description ? `<div>${description}</div>` : ""}
      ${formula ? `<div class="formula">${formula}</div>` : ""}
    </article>
  `).join("");
}

export function renderGroupedReference(container, groups) {
  container.innerHTML = groups.map(group => `
    <article class="reference-item reference-group">
      <header class="reference-concept">
        <strong>${group.title}</strong>
        <div>${group.definition}</div>
      </header>
      <div class="relation-list">
        ${group.relations.map(relation => `
          <section class="relation-item">
            <div class="relation-meta">
              <span class="relation-type">${relation.type}</span>
              <strong class="equation-number">(${relation.id})</strong>
            </div>
            <div class="formula math-display">${relation.formula}</div>
          </section>
        `).join("")}
      </div>
    </article>
  `).join("");
}
