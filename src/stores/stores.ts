import { writable } from "svelte/store";

export let userId = writable("");
export let isLoggedin = writable(false);
export let currentMessage = writable("");
export let userBalance = writable("");
export let tokenSymbol = writable("");
export let isApprove = writable(false);
export let addNotification = writable({
  message: "",
  type: "",
  removeAfter: 0,
  showNotification: false,
});
