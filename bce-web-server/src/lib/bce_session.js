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
        user_color_theme.set(this.get_cookie("color_theme"));
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
        return result;
    }
    
    async update(color_theme = null) {
        //console.log("BceSession.update: color_theme=\"" + color_theme + "\"")
        this.update_session_from_cookie();
        let result = await bce_rest_api.session_update(get(user_session_token), color_theme);
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
  
    async assets(acl_id = null) {
        //console.log("BceSession.assets: here.")
        this.update_session_from_cookie();
        let result = await bce_rest_api.asset_list(get(user_session_token), acl_id);
        //console.log("BceSession.assets: user_email = \"" + get(user_email) + "\", acl_id = \"" + acl_id + "\", result = " + result);
        return result;
    }

}
