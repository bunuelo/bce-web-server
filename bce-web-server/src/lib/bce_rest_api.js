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
    
    async user_create_account(email, password) {
	const response = await fetch(this.apiURL + "/user/create_account", {
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
    
    async session_check_valid(session_token) {
	const response = await fetch(this.apiURL + "/session/check_valid", {
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
    
  async session_create_acl(session_token, display_name) {
	const response = await fetch(this.apiURL + "/session/create_acl", {
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
    
    async session_acls(session_token) {
	const response = await fetch(this.apiURL + "/session/acls", {
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
    
    async inventory_products(session_token) {
	const response = await fetch(this.apiURL + "/inventory/products", {
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
    
  async inventory_create_product(session_token, name, display_name, url, quantity, sale_price) {
	const response = await fetch(this.apiURL + "/inventory/create_product", {
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
    
    async inventory_delete_product(session_token, product_id) {
	const response = await fetch(this.apiURL + "/inventory/delete_product", {
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
    
    async inventory_ingest_products(session_token) {
	const response = await fetch(this.apiURL + "/inventory/ingest_products", {
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
