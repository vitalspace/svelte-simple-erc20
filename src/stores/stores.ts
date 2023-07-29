import { writable } from "svelte/store";

export let userId = writable("");
export let isLoggedin = writable(false);
export let currentMessage = writable("");
