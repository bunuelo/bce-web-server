import { get } from 'svelte/store'
import { user_email, user_session_token, user_session_is_valid, user_security_level, user_color_theme, user_language } from './bce_stores.js'
import { get_system_default_language } from './bce_locale.js'
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

    login(email, session_token) {
        this.set_cookie("email", email, 1);
        this.set_cookie("session_token", session_token, 1);
        this.update_session_from_cookie();
    }
  
    logout() {
        //console.log("BceSession.logout: here.")
        user_email.set("");
        user_session_token.set("");
        this.set_cookie("email", get(user_email), -1);
        this.set_cookie("session_token", get(user_session_token), -1);
        user_session_is_valid.set(false);
        user_security_level.set(0);
    }
    
    update_session_from_cookie() {
        //console.log("BceSession.update_session_from_cookie: here.")
        user_email.set(this.get_cookie("email"));
        user_session_token.set(this.get_cookie("session_token"));
        let cookie_color_theme = this.get_cookie("color_theme");
        if (cookie_color_theme === null) {
            user_color_theme.set("");
        } else {
            user_color_theme.set(cookie_color_theme);
        }
        let cookie_language = this.get_cookie("language");
        if (cookie_language === null) {
            user_language.set("");
        } else {
            user_language.set(cookie_language);
        }
        if (get(user_color_theme) == "") {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                user_color_theme.set("dark");
            } else {
                user_color_theme.set("light");
            }
        }
        if (get(user_language) == "") {
            user_language.set(get_system_default_language());
        }
        //console.log("BceSession.update_session_from_cookie: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\"");
    }
    
    async session_is_valid() {
        //console.log("BceSession.session_is_valid: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.session_valid(get(user_session_token));
        //console.log("BceSession.session_is_valid: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }
    
    async security_level() {
        //console.log("BceSession.security_level: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.session_security_level(get(user_session_token));
        //console.log("BceSession.security_level: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }
    
    async color_theme() {
        //console.log("BceSession.color_theme: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.session_color_theme(get(user_session_token));
        //console.log("BceSession.color_theme: user_email = \"" + get(user_email) + "\", result = " + result);
        this.set_cookie("color_theme", result, 1);
        var color_theme = result;
        if (color_theme == "") {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                color_theme = "dark";
            } else {
                color_theme = "light";
            }
        }
        if (color_theme == "light" || color_theme == "dark") {
            document.documentElement.setAttribute("color-mode", color_theme);
        }
        return result;
    }
    
    async language() {
        //console.log("BceSession.language: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.session_language(get(user_session_token));
        //console.log("BceSession.language: user_email = \"" + get(user_email) + "\", result = " + result);
        this.set_cookie("language", result, 1);
        var language = result;
        if (language == "") {
            language = get_system_default_language();
        }
        return result;
    }
    
    async update(payload = {}) {
        //console.log("BceSession.update: color_theme=\"" + color_theme + "\"")
        this.update_session_from_cookie();
        let result = await bce_rest_api.session_update(get(user_session_token), payload);
        //console.log("BceSession.update: user_email = \"" + get(user_email) + "\", result = " + result);
        return result;
    }
    
    async create_acl(display_name) {
        //console.log("BceSession.create_acl: display_name=\"" + display_name + "\"")
        this.update_session_from_cookie();
        let result = await bce_rest_api.acl_create(get(user_session_token), display_name);
        //console.log("BceSession.create_acl: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }
    
    async delete_acl(acl_id) {
        //console.log("BceSession.delete_acl: acl_id=\"" + acl_id + "\"")
        this.update_session_from_cookie();
        let result = await bce_rest_api.acl_delete(get(user_session_token), acl_id);
        //console.log("BceSession.create_acl: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }
    
    async acl_update(acl_id, display_name = null, _public = null, active = null) {
        //console.log("BceSession.acl_update: acl_id=\"" + acl_id + "\"")
        this.update_session_from_cookie();
        let result = await bce_rest_api.acl_update(get(user_session_token), acl_id, display_name, _public, active);
        //console.log("BceSession.acl_update: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }
    
    async acls() {
        //console.log("BceSession.acls: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.acl_list(get(user_session_token));
        //console.log("BceSession.acls: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }

    async asset_upload(acl_id, file) {
        console.log("BceSession.asset_upload: Upload Begin.  file.name = " + file.name)
        this.update_session_from_cookie();
        let result = await bce_rest_api.asset_upload(get(user_session_token), acl_id, file);
        if (result == true) {
            console.log("BceSession.asset_upload: Upload Successful.  file.name = " + file.name + ", result = " + result);
        } else {
            console.log("BceSession.asset_upload: Upload Failed.  file.name = " + file.name + ", result = " + result);
        }
        return result;
    }
  
    async assets_count(acl_id = null) {
        this.update_session_from_cookie();
        let result = await bce_rest_api.asset_count(get(user_session_token), acl_id);
        return result;
    }

    async assets(acl_id = null) {
        this.update_session_from_cookie();
        let result = await bce_rest_api.asset_list(get(user_session_token), acl_id);
        return result;
    }

    async request_chat(user_email) {
        console.log("BceSession.request_chat: user_email=\"" + user_email + "\"")
        this.update_session_from_cookie();
        let result = await bce_rest_api.chat_request(get(user_session_token), user_email);
        //console.log("BceSession.create_acl: user_email = \"" + get(user_email) + "\", user_session_token = \"" + get(user_session_token) + "\", result = " + result);
        return result;
    }
    
    async chat_request_list() {
        console.log("BceSession.chat_request_list: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.chat_request_list(get(user_session_token));
        return result;
    }
    
    async chat_request_response(email, accept) {
        console.log("BceSession.chat_request_response: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.chat_request_response(get(user_session_token), email, accept);
        return result;
    }
    
    async chat_user_list() {
        console.log("BceSession.chat_user_list: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.chat_user_list(get(user_session_token));
        return result;
    }
    
}
