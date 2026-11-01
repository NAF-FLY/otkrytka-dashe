const wishes = [
  "Пусть на творчество всегда находятся и вдохновение, и силы, и тот самый материал, который нигде не продавался.",
  "Желаю тебе редкий дроп: спокойствие, хороший сон и мем, который смешит даже с пятого раза.",
  "Пусть твои «а что, если…» превращаются во что-то классное.",
  "Пусть рядом будут люди, которые тоже остановятся посмотреть на красивого жука.",
  "Пусть твоим мечтам будет где развернуться. Даже самым странным. Особенно им.",
  "Желаю побольше «как же мне хорошо» и поменьше «надо было ответить вот так» перед сном.",
];

const card = document.querySelector(".postcard");
const cover = document.querySelector("#cover");
const inside = document.querySelector("#inside");
const openButton = document.querySelector("#open-card");
const closeButton = document.querySelector("#close-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const confettiLayer = document.querySelector(".confetti-layer");
let turning = false;
let wishIndex = -1;

function turnCard(open) {
  if (turning) return;
  const update = () => {
    cover.hidden = open;
    inside.hidden = !open;
    openButton.setAttribute("aria-expanded", String(open));
    if (open)
      document.querySelector("#inside-title").focus({ preventScroll: true });
    else openButton.focus({ preventScroll: true });
    card.scrollIntoView({ block: "nearest", behavior: "instant" });
  };
  if (reducedMotion.matches) {
    update();
    return;
  }
  turning = true;
  card.classList.add("is-turning");
  setTimeout(update, 210);
  setTimeout(() => {
    card.classList.remove("is-turning");
    turning = false;
  }, 430);
}

openButton.addEventListener("click", () => turnCard(true));
closeButton.addEventListener("click", () => turnCard(false));

document.querySelector("#wish-button").addEventListener("click", () => {
  const step = 1 + Math.floor(Math.random() * (wishes.length - 1));
  wishIndex = (wishIndex + step) % wishes.length;
  const text = document.querySelector("#wish-text");
  text.textContent = wishes[wishIndex];
  text.classList.add("is-revealed");
});

function celebrate() {
  if (reducedMotion.matches) return;
  const colors = ["#eeb5cf", "#b59bce", "#d1dea6", "#fffaf3"];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 35; i += 1) {
    const particle = document.createElement("i");
    particle.className = "confetti";
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${5 + Math.random() * 7}px`);
    particle.style.setProperty("--color", colors[i % colors.length]);
    particle.style.setProperty("--duration", `${2 + Math.random() * 1.8}s`);
    particle.style.setProperty("--drift", `${Math.random() * 150 - 75}px`);
    particle.addEventListener("animationend", () => particle.remove(), {
      once: true,
    });
    fragment.append(particle);
  }
  confettiLayer.replaceChildren(fragment);
}

const magic = document.querySelector(".magic-dialog");
const magicButton = document.querySelector("#magic-button");
const transformation = document.querySelector(".transformation");
const motes = document.querySelector(".magic-motes");
let transformationTimer;
let transformationActive = false;

function resetTransformation() {
  clearTimeout(transformationTimer);
  transformationActive = false;
  magicButton.disabled = false;
  magicButton.removeAttribute("aria-busy");
  motes.replaceChildren();
}

function revealMagic() {
  resetTransformation();
  if (transformation.open) transformation.close();
  if (magic.open) return;
  magic.showModal();
  magic.scrollTop = 0;
  document.body.classList.add("dialog-open");
  celebrate();
}

function gatherStars() {
  const rect = magicButton.getBoundingClientRect();
  const fromX = rect.left + rect.width / 2 - window.innerWidth / 2;
  const fromY = rect.top + rect.height / 2 - window.innerHeight * 0.4;
  const fragment = document.createDocumentFragment();
  const radius = Math.min(window.innerWidth * 0.35, 155);
  for (let i = 0; i < 24; i += 1) {
    const star = document.createElement("span");
    const angle = (i / 24) * Math.PI * 2;
    star.className = "magic-mote";
    star.textContent = i % 3 === 0 ? "✧" : "✦";
    star.style.setProperty("--from-x", `${fromX + Math.cos(angle) * 35}px`);
    star.style.setProperty("--from-y", `${fromY + Math.sin(angle) * 35}px`);
    star.style.setProperty("--orbit-x", `${Math.cos(angle) * radius}px`);
    star.style.setProperty("--orbit-y", `${Math.sin(angle) * radius}px`);
    star.style.setProperty("--delay", `${i * 12}ms`);
    star.style.setProperty("--size", `${10 + (i % 4) * 4}px`);
    fragment.append(star);
  }
  motes.replaceChildren(fragment);
}

magicButton.addEventListener("click", () => {
  if (transformationActive || magic.open) return;
  if (reducedMotion.matches) {
    revealMagic();
    return;
  }
  gatherStars();
  transformationActive = true;
  magicButton.disabled = true;
  magicButton.setAttribute("aria-busy", "true");
  transformation.showModal();
  document.body.classList.add("dialog-open");
  transformationTimer = setTimeout(revealMagic, 1850);
});
document
  .querySelector(".skip-transformation")
  .addEventListener("click", revealMagic);
transformation.addEventListener("cancel", resetTransformation);
transformation.addEventListener("close", () => {
  if (magic.open) return;
  resetTransformation();
  document.body.classList.remove("dialog-open");
});
document.querySelectorAll(".dialog-close, .magic-done").forEach((button) => {
  button.addEventListener("click", () => magic.close());
});
magic.addEventListener("click", (event) => {
  const rect = magic.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    magic.close();
});
magic.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  confettiLayer.replaceChildren();
});
reducedMotion.addEventListener("change", () => {
  confettiLayer.replaceChildren();
  if (reducedMotion.matches && transformationActive) revealMagic();
});
