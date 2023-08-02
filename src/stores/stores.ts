import { writable } from "svelte/store";

interface Notification {
    message: string
    type: string
    removeAfther: number
}

export let userId = writable("");
export let isLoggedin = writable(false);
export let currentMessage = writable("");
export let isApprove = writable(false);
export let showNotification = writable(false);
export let addNotification = writable({
    message: "",
    type: "",
    removeAfter: 0,
    showNotification: false
})