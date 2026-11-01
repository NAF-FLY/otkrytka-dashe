const wishes = [
  "Пусть на творчество всегда находятся и вдохновение, и силы, и тот самый материал, который нигде не продавался.",
  "Желаю тебе редкий дроп: спокойствие, хороший сон и мем, который смешит даже с пятого раза.",
  "Пусть твои «а что, если…» превращаются во что-то классное.",
  "Пусть рядом будут люди, которые тоже остановятся посмотреть на красивого жука.",
  "Пусть твоим мечтам будет где развернуться. Даже самым странным. Особенно им.",
  "Желаю побольше «как же мне хорошо» и поменьше «надо было ответить вот так» перед сном."
]

const card = document.querySelector(".postcard")
const cover = document.querySelector("#cover")
const inside = document.querySelector("#inside")
const openButton = document.querySelector("#open-card")
const closeButton = document.querySelector("#close-card")
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
const confettiLayer = document.querySelector(".confetti-layer")
let turning = false
let wishIndex = -1

function turnCard(open) {
  if (turning) return
  const update = () => {
    cover.hidden = open
    inside.hidden = !open
    openButton.setAttribute("aria-expanded", String(open))
    if (open) document.querySelector("#inside-title").focus({ preventScroll: true })
    else openButton.focus({ preventScroll: true })
    card.scrollIntoView({ block: "nearest", behavior: "instant" })
  }
  if (reducedMotion.matches) {
    update()
    return
  }
  turning = true
  card.classList.add("is-turning")
  setTimeout(update, 210)
  setTimeout(() => {
    card.classList.remove("is-turning")
    turning = false
  }, 430)
}

openButton.addEventListener("click", () => turnCard(true))
closeButton.addEventListener("click", () => turnCard(false))

document.querySelector("#wish-button").addEventListener("click", () => {
  const step = 1 + Math.floor(Math.random() * (wishes.length - 1))
  wishIndex = (wishIndex + step) % wishes.length
  const text = document.querySelector("#wish-text")
  text.textContent = wishes[wishIndex]
  text.classList.add("is-revealed")
})

function celebrate() {
  if (reducedMotion.matches) return
  const colors = ["#eeb5cf", "#b59bce", "#d1dea6", "#fffaf3"]
  const fragment = document.createDocumentFragment()
  for (let i = 0; i < 35; i += 1) {
    const particle = document.createElement("i")
    particle.className = "confetti"
    particle.style.setProperty("--x", `${Math.random() * 100}%`)
    particle.style.setProperty("--size", `${5 + Math.random() * 7}px`)
    particle.style.setProperty("--color", colors[i % colors.length])
    particle.style.setProperty("--duration", `${2 + Math.random() * 1.8}s`)
    particle.style.setProperty("--drift", `${Math.random() * 150 - 75}px`)
    particle.addEventListener("animationend", () => particle.remove(), { once: true })
    fragment.append(particle)
  }
  confettiLayer.replaceChildren(fragment)
}

const magic = document.querySelector(".magic-dialog")
document.querySelector("#magic-button").addEventListener("click", () => {
  magic.showModal()
  magic.scrollTop = 0
  document.body.classList.add("dialog-open")
  celebrate()
})
document.querySelectorAll(".dialog-close, .magic-done").forEach((button) => {
  button.addEventListener("click", () => magic.close())
})
magic.addEventListener("click", (event) => {
  const rect = magic.getBoundingClientRect()
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) magic.close()
})
magic.addEventListener("close", () => {
  document.body.classList.remove("dialog-open")
  confettiLayer.replaceChildren()
})
reducedMotion.addEventListener("change", () => confettiLayer.replaceChildren())
