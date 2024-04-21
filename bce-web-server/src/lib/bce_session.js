import { get } from 'svelte/store'
import { user_email } from './bce_stores.js'
import { user_session_token } from './bce_stores.js'
import { user_session_is_valid } from './bce_stores.js'
import { user_security_level } from './bce_stores.js'
import BceRestApi from "./bce_rest_api.js";
let bce_rest_api = new BceRestApi();

export default class BceSession {
    
    constructor() {
    }
    
    set_cookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=strict";
    }
    
    get_cookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	    let c = ca[i];
	    while (c.charAt(0) == ' ') {
		c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	    }
	}
	return "";
    }

    logout() {
        user_email.set("");
        user_session_token.set("");
        this.set_cookie("email", get(user_email), -1);
        this.set_cookie("session_token", get(user_session_token), -1);
        user_session_is_valid.set(false);
        user_security_level.set(0);
    }
    
    update_session_from_cookie() {
        user_email.set(this.get_cookie("email"));
        user_session_token.set(this.get_cookie("session_token"));
    }
    
    async session_is_valid() {
        this.update_session_from_cookie();
        return await bce_rest_api.user_check_valid_session_token(get(user_email), get(user_session_token));
    }
    
    async security_level() {
        this.update_session_from_cookie();
        return await bce_rest_api.user_security_level(get(user_email), get(user_session_token));
    }
    
}
