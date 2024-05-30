import { writable } from "svelte/store";

export const alert = writable("");
export const user_email = writable("");
export const user_session_token = writable("");
export const user_session_is_valid = writable(false);
export const user_security_level = writable(0);
export const user_color_theme = writable("");
export const user_locale = writable("");

