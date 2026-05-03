const tiles = document.getElementById('tiles');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('attributeModal');

function normalizeAttr(a){
  return {
    number: a.number || a.attribute_number || "",
    category: a.category || "Attribute",
    attribute: a.attribute || a.attribute_name || "Attribute",
    definition: a.definition || "",
    scriptures: (a.scriptures || []).map(s => ({
      reference: s.reference || s[0] || "",
      text: s.text || s[1] || ""
    }))
  };
}

const DATA = GOD_ATTRIBUTES.map(normalizeAttr);

function loadCategories(){
  const cats = [...new Set(DATA.map(a => a.category).filter(Boolean))].sort();
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

function renderTiles(){
  const q = searchInput.value.toLowerCase();
  const cat = categoryFilter.value;
  tiles.innerHTML = "";
  DATA.filter(a => {
    const text = `${a.attribute} ${a.definition} ${a.category}`.toLowerCase();
    return (!q || text.includes(q)) && (!cat || a.category === cat);
  }).forEach(a => {
    const div = document.createElement('div');
    div.className = 'tile';
    div.innerHTML = `
      <p class="eyebrow">${a.category}</p>
      <h3>${a.attribute}</h3>
      <p>${a.definition}</p>
    `;
    div.onclick = () => openAttribute(a);
    tiles.appendChild(div);
  });
}

function openAttribute(a){
  document.getElementById('modalCategory').textContent = a.category;
  document.getElementById('modalTitle').textContent = a.attribute;
  document.getElementById('modalDefinition').textContent = a.definition;
  document.getElementById('modalScriptures').innerHTML = a.scriptures.map(s => `
    <div class="scripture">
      <strong>${s.reference}</strong>
      <span>${s.text}</span>
    </div>
  `).join('');
  modal.showModal();
}

document.getElementById('closeModal').onclick = () => modal.close();
searchInput.oninput = renderTiles;
categoryFilter.onchange = renderTiles;

function setDaily(){
  const today = new Date();
  const idx = Math.floor(today.getTime() / 86400000) % DATA.length;
  const a = DATA[idx];
  document.getElementById('dailyTitle').textContent = a.attribute;
  document.getElementById('dailyDefinition').textContent = a.definition;
  const s = a.scriptures[0] || {};
  document.getElementById('dailyVerse').textContent = `${s.reference || ""} — ${s.text || ""}`;
}

loadCategories();
renderTiles();
setDaily();
