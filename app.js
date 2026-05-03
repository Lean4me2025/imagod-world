const tiles = document.getElementById('tiles');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('attributeModal');
const accessModal = document.getElementById('accessModal');
const countdownEl = document.getElementById('countdown');
const TILE_COUNT = 20;
const ROTATION_SECONDS = 30;
let rotationStart = 0;
let secondsLeft = ROTATION_SECONDS;
let countdownTimer;

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
function filteredData(){
  const q = searchInput.value.toLowerCase();
  const cat = categoryFilter.value;
  return DATA.filter(a => {
    const scriptureText = (a.scriptures || []).map(s => `${s.reference} ${s.text}`).join(' ');
    const text = `${a.attribute} ${a.definition} ${a.category} ${scriptureText}`.toLowerCase();
    return (!q || text.includes(q)) && (!cat || a.category === cat);
  });
}
function getRotatingSlice(list){
  if (list.length <= TILE_COUNT) return list;
  const start = rotationStart % list.length;
  const result = [];
  for (let i = 0; i < TILE_COUNT; i++) result.push(list[(start + i) % list.length]);
  return result;
}
function renderTiles(){
  const visible = getRotatingSlice(filteredData());
  tiles.innerHTML = "";
  visible.forEach(a => {
    const div = document.createElement('div');
    div.className = 'tile';
    div.innerHTML = `<p class="eyebrow">${a.category}</p><h3>${a.attribute}</h3><p>${a.definition}</p>`;
    div.onclick = () => openAttribute(a);
    tiles.appendChild(div);
  });
}
function rotateTiles(){
  const list = filteredData();
  if (list.length > TILE_COUNT) rotationStart += TILE_COUNT;
  else rotationStart = 0;
  secondsLeft = ROTATION_SECONDS;
  renderTiles();
}
function startCountdown(){
  clearInterval(countdownTimer);
  secondsLeft = ROTATION_SECONDS;
  countdownEl.textContent = secondsLeft;
  countdownTimer = setInterval(() => {
    secondsLeft -= 1;
    countdownEl.textContent = secondsLeft;
    if (secondsLeft <= 0) rotateTiles();
  }, 1000);
}
function openAttribute(a){
  const firstScripture = a.scriptures[0] ? [a.scriptures[0]] : [];
  document.getElementById('modalCategory').textContent = a.category;
  document.getElementById('modalTitle').textContent = a.attribute;
  document.getElementById('modalDefinition').textContent = a.definition;
  document.getElementById('modalScriptures').innerHTML = firstScripture.map(s => `<div class="scripture"><strong>${s.reference}</strong><span>${s.text}</span></div>`).join('');
  modal.showModal();
}
function openAccessModal(){ accessModal.showModal(); }
function switchToAccess(){
  modal.close();
  accessModal.showModal();
}

document.getElementById('closeModal').onclick = () => modal.close();
document.getElementById('closeAccessModal').onclick = () => accessModal.close();
document.getElementById('shuffleButton').onclick = rotateTiles;
searchInput.oninput = () => { rotationStart = 0; secondsLeft = ROTATION_SECONDS; renderTiles(); };
categoryFilter.onchange = () => { rotationStart = 0; secondsLeft = ROTATION_SECONDS; renderTiles(); };

function setDaily(){
  const today = new Date();
  const idx = Math.floor(today.getTime() / 86400000) % DATA.length;
  const a = DATA[idx];
  document.getElementById('dailyTitle').textContent = a.attribute;
  document.getElementById('dailyDefinition').textContent = a.definition;
  const s = a.scriptures[0] || {};
  document.getElementById('dailyVerse').textContent = `${s.reference || ""} — ${s.text || ""}`;
}

document.getElementById('captureForm').addEventListener('submit', function(e){
  e.preventDefault();
  const msg = document.getElementById('captureMessage');
  msg.textContent = "Thank you. Your daily Scripture interest has been received. Supabase storage will be connected next.";
  this.reset();
});

loadCategories();
renderTiles();
startCountdown();
setDaily();
