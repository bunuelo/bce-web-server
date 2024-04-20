import { writable } from "svelte/store";

export const alert = writable("");
export const user_email = writable("");
export const user_session_token = writable("");
export const user_session_is_valid = writable(false);

