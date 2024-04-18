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
	this.set_cookie("email", "", -1);
	this.set_cookie("session_token", "", -1);
    }
    
    async session_is_valid() {
	let email = this.get_cookie("email");
	let session_token = this.get_cookie("session_token");
	return await bce_rest_api.user_check_valid_session_token(email, session_token);
    }
    
}
