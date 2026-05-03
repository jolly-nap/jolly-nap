/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

const SLEEP_CYCLE_MS = 90 * 60 * 1000
const SLEEP_WARMUP_MS = 15 * 60 * 1000
const SLEEP_PREP_MINUTES = 14
const SLEEP_CYCLES = 6

window.addEventListener("load", () => {
	setTimeout(() => window.scrollTo(0, 1), 0)
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("./service-worker.js").catch(() => {
			/* registration failure is non-fatal — the app still works without offline support */
		})
	}
})

/**
 * Formats a date as a 12-hour clock string with leading zeroes and a meridian suffix.
 *
 * @param {Date} date - Date to format.
 *
 * @returns {string} The formatted clock string.
 */
function humanDateString(date) {
	let hours = date.getHours()
	const minutes = date.getMinutes()
	let am = true
	if (hours > 12) {
		am = false
		hours -= 12
	} else if (hours === 12) {
		am = false
	} else if (hours === 0) {
		hours = 12
	}
	const hh = String(hours).padStart(2, "0")
	const mm = String(minutes).padStart(2, "0")
	return `${hh}:${mm} ${am ? "AM" : "PM"}`
}

/**
 * Toggles a CSS animation class on an element and resolves once the animation ends.
 *
 * @param {HTMLElement} el - Target element.
 * @param {string} className - Animation class to apply.
 *
 * @returns {Promise<void>} Resolves when the animation finishes.
 */
function runAnimationClass(el, className) {
	return new Promise((/** @type {() => void} */ resolve) => {
		const handler = () => {
			el.removeEventListener("animationend", handler)
			el.classList.remove(className)
			resolve()
		}
		el.addEventListener("animationend", handler, { once: true })
		el.classList.add(className)
	})
}

/**
 * Fades an element out and then sets its display to none.
 *
 * @param {HTMLElement | null} el - Element to fade out, or null to skip.
 */
async function fadeOut(el) {
	if (!el || el.style.display === "none") return
	await runAnimationClass(el, "jn-fade-out")
	el.style.display = "none"
}

/**
 * Reveals an element with a fade-in animation.
 *
 * @param {HTMLElement | null} el - Element to fade in, or null to skip.
 * @param {string} [displayValue] - CSS display value to apply before fading. Defaults to "block".
 */
async function fadeIn(el, displayValue = "block") {
	if (!el) return
	el.style.display = displayValue
	await runAnimationClass(el, "jn-fade-in")
}

/**
 * Fades in every element matching a selector in parallel.
 *
 * @param {string} selector - CSS selector to match.
 * @param {string} [displayValue] - CSS display value applied before fading. Defaults to "block".
 */
function fadeInAll(selector, displayValue = "block") {
	const elements = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll(selector))
	return Promise.all([...elements].map((el) => fadeIn(el, displayValue)))
}

/**
 * Smoothly scrolls so the matching element sits ten pixels below the viewport top.
 *
 * @param {string} selector - CSS selector for the scroll target.
 */
function smoothScrollTo(selector) {
	const target = document.querySelector(selector)
	if (!target) return
	const top = target.getBoundingClientRect().top + window.scrollY - 10
	window.scrollTo({ top, behavior: "smooth" })
}

/**
 * Builds a time-row DOM node with a wellness color tier.
 *
 * @param {string} time - Formatted time string to display.
 * @param {number} wellness - Wellness tier index used by CSS to color the entry.
 * @param {string} type - CSS class for the inner element (e.g. "wake-time" or "bed-time").
 *
 * @returns {HTMLDivElement} The container element ready to be appended.
 */
function createTimeNode(time, wellness, type) {
	const container = document.createElement("div")
	container.className = "time-container"
	const inner = document.createElement("div")
	inner.className = type
	inner.dataset.wellness = String(wellness)
	inner.textContent = time
	container.appendChild(inner)
	return container
}

async function sleepNow() {
	const wakeTimesContainer = document.getElementById("wake-times")
	if (!wakeTimesContainer) return

	const now = new Date()
	now.setMinutes(Math.round(now.getMinutes() / 10) * 10)

	const wakeTimes = []
	for (let i = 0; i < SLEEP_CYCLES; i++) {
		const offset = i === 0 ? SLEEP_PREP_MINUTES + 90 : 90
		now.setMinutes(now.getMinutes() + offset)
		wakeTimes.push(humanDateString(now))
	}

	await fadeOut(/** @type {HTMLElement | null} */ (document.querySelector(".site-footer")))

	wakeTimesContainer.replaceChildren()
	for (let i = wakeTimes.length - 1; i >= 0; i--) {
		const entry = wakeTimes[i]
		if (entry !== undefined) {
			wakeTimesContainer.appendChild(createTimeNode(entry, i, "wake-time"))
		}
	}

	document.querySelector(".wrapper")?.classList.add("no-footer")

	await fadeInAll(".wake-time-explanation, .wake-up-at, .share")

	smoothScrollTo(".wake-up-at")
}

/**
 * Computes recommended bed times for the given target wake-up clock and renders them.
 *
 * @param {number} wakeHour - Wake-up hour in 24-hour clock.
 * @param {number} wakeMinute - Wake-up minute.
 */
async function findBedtime(wakeHour, wakeMinute) {
	const bedTimesContainer = document.getElementById("bed-times")
	if (!bedTimesContainer) return

	const adjustedMinute = Math.round(wakeMinute / 10) * 10
	const wakeTime = new Date()
	wakeTime.setHours(wakeHour)
	wakeTime.setMinutes(adjustedMinute)

	const bedTimes = []
	for (let i = 0; i < SLEEP_CYCLES; i++) {
		wakeTime.setTime(wakeTime.getTime() - SLEEP_CYCLE_MS)
		if (i >= 2) {
			const compensated = new Date(wakeTime.getTime() - SLEEP_WARMUP_MS)
			bedTimes.push(humanDateString(compensated))
		}
	}

	await fadeOut(/** @type {HTMLElement | null} */ (document.querySelector(".get-up.blurb")))

	bedTimesContainer.replaceChildren()
	for (let i = bedTimes.length - 1; i >= 0; i--) {
		const entry = bedTimes[i]
		if (entry !== undefined) {
			bedTimesContainer.appendChild(createTimeNode(entry, i + 2, "bed-time"))
		}
	}

	await fadeInAll(".sleep-at, .bed-time-explanation.blurb, .share")

	smoothScrollTo(".wake-up-container")
}

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("sleep-now")?.addEventListener("click", (e) => {
		e.preventDefault()
		sleepNow()
	})

	document.getElementById("calculate-wake-time")?.addEventListener("click", (e) => {
		e.preventDefault()
		document.getElementById("wake-up-time")?.focus()
	})

	document.getElementById("wake-up-time")?.addEventListener("change", (e) => {
		const target = /** @type {HTMLInputElement | null} */ (e.target)
		const value = target?.value
		if (!value) return
		const [hh, mm] = value.split(":")
		if (hh === undefined || mm === undefined) return
		findBedtime(parseInt(hh, 10), parseInt(mm, 10))
	})
})
