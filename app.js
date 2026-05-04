const tiles = document.getElementById('tiles');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('attributeModal');
const TILE_COUNT = 20;
const ROTATION_SECONDS = 15;
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
  countdownTimer = setInterval(() => {
    secondsLeft -= 1;
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

document.getElementById('closeModal').onclick = () => modal.close();
document.getElementById('shuffleButton').onclick = rotateTiles;
searchInput.oninput = () => { rotationStart = 0; renderTiles(); };
categoryFilter.onchange = () => { rotationStart = 0; renderTiles(); };

function setDaily(){
  const today = new Date();
  const idx = Math.floor(today.getTime() / 86400000) % DATA.length;
  const a = DATA[idx];
  document.getElementById('dailyTitle').textContent = a.attribute;
  document.getElementById('dailyDefinition').textContent = a.definition;
  const s = a.scriptures[0] || {};
  document.getElementById('dailyVerse').textContent = `${s.reference || ""} — ${s.text || ""}`;
}

/* =========================================================
   SUPABASE REGISTRATION + PLAN PAYMENT FLOW
   Paste your anon public key in the placeholder below.
========================================================= */

const SUPABASE_URL = "https://xaiwaotwfstwmcqibuic.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXdhb3R3ZnN0d21jcWlidWljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzE3ODcsImV4cCI6MjA5MzQwNzc4N30.XyHrR5Tc1eBc96IT5tE4pbnhgcmke-GgvhwB7hHZs-c";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BASIC_PAY_LINK = "https://buy.stripe.com/6oU7sN2SacZh9ePdw66J201";
const FULL_PAY_LINK = "https://buy.stripe.com/5kQcN71O67EX9eP2Rs6J200";

function planLabel(plan) {
  if (plan === "basic") return "Basic Access — $19.99/year";
  if (plan === "full") return "Full Study Access — $50/year";
  return "Free daily Scripture";
}

function setSelectedPlan(plan) {
  const planSelect = document.getElementById("planSelect");
  const selectedPlanText = document.getElementById("selectedPlanText");
  if (!planSelect || !selectedPlanText) return;

  planSelect.value = plan;
  selectedPlanText.textContent = "Selected plan: " + planLabel(plan);

  document.getElementById("register")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

document.querySelectorAll(".plan-select").forEach(button => {
  button.addEventListener("click", () => setSelectedPlan(button.dataset.plan || "free"));
});

const planSelect = document.getElementById("planSelect");
if (planSelect) {
  planSelect.addEventListener("change", () => {
    document.getElementById("selectedPlanText").textContent = "Selected plan: " + planLabel(planSelect.value);
  });
}

async function saveOrUpdateRegistration(payload) {
  const { data: existingRows, error: lookupError } = await supabaseClient
    .from("iamgod_registrations")
    .select("id")
    .eq("email", payload.email)
    .limit(1);

  if (lookupError) {
    throw lookupError;
  }

  if (existingRows && existingRows.length > 0) {
    const { error: updateError } = await supabaseClient
      .from("iamgod_registrations")
      .update(payload)
      .eq("email", payload.email);

    if (updateError) {
      throw updateError;
    }

    return "updated";
  }

  const { error: insertError } = await supabaseClient
    .from("iamgod_registrations")
    .insert([payload]);

  if (insertError) {
    throw insertError;
  }

  return "inserted";
}

const accessForm = document.getElementById("accessForm");
if (accessForm) {
  accessForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const selectedPlan = document.getElementById("planSelect").value;
    const name = document.getElementById("accessName").value.trim();
    const email = document.getElementById("accessEmail").value.trim().toLowerCase();
    const phone = document.getElementById("accessPhone").value.trim();
    const consent = document.getElementById("accessConsent").checked;
    const msg = document.getElementById("accessMessage");

    msg.textContent = "Saving your registration...";

    let paymentStatus = "pending";
    let accessStatus = "pending_payment";

    if (selectedPlan === "free") {
      paymentStatus = "free";
      accessStatus = "active";
    }

    const payload = {
      name: name,
      email: email,
      phone: phone,
      selected_plan: selectedPlan,
      access_level: selectedPlan,
      payment_status: paymentStatus,
      access_status: accessStatus,
      daily_email_opt_in: true,
      future_sms_opt_in: consent
    };

    try {
      await saveOrUpdateRegistration(payload);
    } catch (error) {
      console.error("Supabase registration/update error:", error);
      msg.textContent = "Registration could not be saved. Please check the Supabase key and table settings.";
      return;
    }

    if (selectedPlan === "basic") {
      msg.textContent = "Registration saved. Redirecting to Basic Access payment...";
      setTimeout(() => {
        window.location.href = BASIC_PAY_LINK;
      }, 700);
      return;
    }

    if (selectedPlan === "full") {
      msg.textContent = "Registration saved. Redirecting to Full Study payment...";
      setTimeout(() => {
        window.location.href = FULL_PAY_LINK;
      }, 700);
      return;
    }

    msg.textContent = "Thank you. You are registered to receive daily Scripture.";
    this.reset();
    setSelectedPlan("free");
  });
}

loadCategories();
renderTiles();
startCountdown();
setDaily();
