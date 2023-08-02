import { writable } from "svelte/store";

export let userId = writable("");
export let isLoggedin = writable(false);
export let currentMessage = writable("");
export let isApprove = writable(false);
export let showErr = writable(false);
export let errorMessage = writable({})