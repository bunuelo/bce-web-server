export default class BceRestApi {
    
    constructor() {
	this.apiURL = "https://bce.center:8000";
	this.message = "";
    }
    
    async root() {
	const response = await fetch(this.apiURL + "/");
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json;
    }
    
    async generate(ipd) {
	const response = await fetch(this.apiURL + "/generate?" + new URLSearchParams({
	    ipd: ipd
	}));
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.model_url;
    }
    
    async options() {
	const response = await fetch(this.apiURL + "/options");
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.options;
    }
    
    async user_create(email, password) {
	const response = await fetch(this.apiURL + "/user/create", {
	    method: "POST",
	    body: JSON.stringify({
		email: email,
		password: password
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async user_login(email, password) {
	const response = await fetch(this.apiURL + "/user/login", {
	    method: "POST",
	    body: JSON.stringify({
		email: email,
		password: password
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.session_token;
    }
    
    async session_valid(session_token) {
	const response = await fetch(this.apiURL + "/session/valid", {
	    method: "POST",
	    body: JSON.stringify({
		session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.session_token_is_valid;
    }
    
    async session_security_level(session_token) {
	const response = await fetch(this.apiURL + "/session/security_level", {
	    method: "POST",
	    body: JSON.stringify({
		session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.security_level;
    }
    
  async acl_create(session_token, display_name) {
	const response = await fetch(this.apiURL + "/acl/create", {
	    method: "POST",
	    body: JSON.stringify({
	      session_token: session_token,
              display_name: display_name
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_delete(session_token, acl_id) {
	const response = await fetch(this.apiURL + "/acl/delete", {
	    method: "POST",
	    body: JSON.stringify({
	      session_token: session_token,
              acl_id: acl_id
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_update(session_token, acl_id, _public = null, active = null) {
	const response = await fetch(this.apiURL + "/acl/delete", {
	    method: "POST",
	    body: JSON.stringify({
	      session_token: session_token,
              acl_id: acl_id,
              "public": _public,
              active: active
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_list(session_token) {
	const response = await fetch(this.apiURL + "/acl/list", {
	    method: "POST",
	    body: JSON.stringify({
		session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.acls;
    }
    
    async product_list(session_token) {
	const response = await fetch(this.apiURL + "/product/list", {
	    method: "POST",
	    body: JSON.stringify({
		session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.products;
    }
    
  async product_create(session_token, name, display_name, url, quantity, sale_price) {
	const response = await fetch(this.apiURL + "/product/create", {
	    method: "POST",
	    body: JSON.stringify({
  	        session_token: session_token,
                name: name,
                display_name: display_name,
                url: url,
                quantity: quantity,
                sale_price: sale_price
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async product_delete(session_token, product_id) {
	const response = await fetch(this.apiURL + "/product/delete", {
	    method: "POST",
	    body: JSON.stringify({
  	        session_token: session_token,
                product_id: product_id
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async product_ingest(session_token) {
	const response = await fetch(this.apiURL + "/product/ingest", {
	    method: "POST",
	    body: JSON.stringify({
  	        session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
}
