/**
 * @copyright Sister Software
 * @license AGPL-3.0
 * @author Teffen Ellis, et al.
 */

/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="webworker"/>

const sw = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis))

const CACHE_VERSION = "v2"
const CACHE_NAME = `jolly-nap-${CACHE_VERSION}`

const APP_SHELL = [
	"./",
	"./index.html",
	"./manifest.webmanifest",
	"./stylesheets/application.css",
	"./javascripts/application.js",
	"./javascripts/add2home.js",
	"./favicon.ico",
	"./icons/icon-ios-marketing-1024x1024.png",
	"./icons/icon-iphone-29x29@2x.png",
	"./icons/icon-iphone-29x29@3x.png",
]

sw.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
	sw.skipWaiting()
})

sw.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
			.then(() => sw.clients.claim())
	)
})

/**
 * Stores a network response in the runtime cache.
 *
 * @param {Request} request - Originating request.
 * @param {Response} response - Response to cache.
 */
async function cachePut(request, response) {
	const cache = await caches.open(CACHE_NAME)
	await cache.put(request, response)
}

sw.addEventListener("fetch", (event) => {
	const { request } = event
	if (request.method !== "GET") return

	const url = new URL(request.url)
	if (url.origin !== sw.location.origin) return

	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request)
				.then((response) => {
					cachePut(request, response.clone())
					return response
				})
				.catch(async () => {
					const cached = await caches.match(request)
					return cached ?? (await caches.match("./index.html")) ?? Response.error()
				})
		)
		return
	}

	event.respondWith(
		caches.match(request).then((cached) => {
			if (cached) return cached
			return fetch(request).then((response) => {
				if (response.ok && response.type === "basic") {
					cachePut(request, response.clone())
				}
				return response
			})
		})
	)
})
