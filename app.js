const grid = document.getElementById("grid");
const search = document.getElementById("search");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const closeBtn = document.getElementById("closeBtn");

let actors = [];
let filtered = [];
let currentIndex = -1;

function render(list) {
  grid.innerHTML = "";
  list.forEach((a, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.className = "thumb";
    img.src = a.image;
    img.alt = a.name;

    const cap = document.createElement("div");
    cap.className = "caption";
    cap.textContent = "Click to reveal";

    card.appendChild(img);
    card.appendChild(cap);

    card.addEventListener("click", () => openModal(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(idx);
    });

    grid.appendChild(card);
  });
}

function openModal(index) {
  currentIndex = index;
  const a = filtered[currentIndex];
  modalImg.src = a.image;
  modalImg.alt = a.name;
  modalName.textContent = a.name;
  modalBackdrop.classList.remove("hidden");
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  currentIndex = -1;
}

function move(delta) {
  if (currentIndex === -1) return;
  const next = (currentIndex + delta + filtered.length) % filtered.length;
  openModal(next);
}

search.addEventListener("input", () => {
  const q = search.value.trim().toLowerCase();
  filtered = actors.filter(a => a.name.toLowerCase().includes(q));
  render(filtered);
});

closeBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (modalBackdrop.classList.contains("hidden")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") move(+1);
  if (e.key === "ArrowLeft") move(-1);
});

async function init() {
  const res = await fetch("data.json");
  actors = await res.json();
  filtered = actors.slice();
  render(filtered);
}

init();

