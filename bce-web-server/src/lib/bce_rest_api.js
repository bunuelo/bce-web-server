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
    
    async fetch_json(url, options) {
        return await fetch(url, options).then((response) => {
            if (response.ok) {
                return response.json();
            }
            console.log("rest_call ERROR: ")
            return null
        }).then((responseJson) => {
            return responseJson
        }).catch((error) => {
            console.log("rest_call ERROR: " + error)
            return null
        });
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
	}).catch(function (error) {
            console.log("user_create error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("user_login error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("session_valid error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("session_security_level error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.security_level;
    }
    
    async session_color_theme(session_token) {
	const response = await fetch(this.apiURL + "/session/color_theme", {
	    method: "POST",
	    body: JSON.stringify({
		session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("session_color_theme error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.color_theme;
    }
    
    async session_language(session_token) {
	const response = await fetch(this.apiURL + "/session/language", {
	    method: "POST",
	    body: JSON.stringify({
		session_token: session_token
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("session_language error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.language;
    }
    
    async session_update(session_token, payload) {
        var color_theme = null;
        var language = null;
        if ("color_theme" in payload) {
            color_theme = payload.color_theme;
        }
        if ("language" in payload) {
            language = payload.language;
        }
        var body = {
    	    session_token: session_token
	}
        if (color_theme != null) {
            body["color_theme"] = color_theme;
        }
        if (language != null) {
            body["language"] = language;
        }
	const response = await fetch(this.apiURL + "/session/update", {
	    method: "POST",
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("session_update error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
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
	}).catch(function (error) {
            console.log("acl_create error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("acl_delete error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_update(session_token, acl_id, display_name = null, _public = null, active = null) {
        var body = {
	    session_token: session_token,
            acl_id: acl_id
	}
        if (display_name != null) {
            body["display_name"] = display_name;
        }
        if (_public != null) {
            body["public"] = _public;
        }
        if (active != null) {
            body["active"] = active;
        }
        console.log("acl_update: body = " + JSON.stringify(body));
        const response = await fetch(this.apiURL + "/acl/update", {
	    method: "POST",
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("acl_update error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_list(session_token, writable = null) {
        var body = {
	    session_token: session_token
	}
        if (writable != null) {
            body["writable"] = writable;
        }
        const response = await fetch(this.apiURL + "/acl/list", {
	    method: "POST",
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("acl_list error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("product_list error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("product_create error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("product_delete error: " + error)
            return null
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
	}).catch(function (error) {
            console.log("product_ingest error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }

    async asset_upload(session_token, acl_id, file) {
        var data = new FormData();
        data.append("session_token", session_token);
        data.append("acl_id", Number(acl_id));
        data.append("file", file, file.name);
        const response = await fetch(this.apiURL + "/asset/upload", {
            method: 'POST',
            body: data
        }).catch(function (error) {
            console.log("asset_upload error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
  
    async asset_count(session_token, acl_id = null) {
        var body = {
  	    session_token: session_token
	}
        if (acl_id) {
            body["acl_id"] = acl_id;
        }
        const response = await fetch(this.apiURL + "/asset/count", {
	    method: "POST",
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("asset_count error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.count;
    }
  
    async asset_list(session_token, acl_id = null) {
        var body = {
  	    session_token: session_token
	}
        if (acl_id) {
            body["acl_id"] = acl_id;
        }
        const response = await fetch(this.apiURL + "/asset/list", {
	    method: "POST",
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("asset_list error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.assets;
    }
  
    async chat_request(session_token, user_email) {
	const response = await fetch(this.apiURL + "/chat/request", {
	    method: "POST",
	    body: JSON.stringify({
	      session_token: session_token,
              user_email: user_email
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
    async chat_request_list(session_token) {
	const response = await fetch(this.apiURL + "/chat/request/list", {
	    method: "POST",
	    body: JSON.stringify({
  	        session_token: session_token,
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("chat_request_list error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.chat_requests;
    }
    
  async chat_request_response(session_token, email, accept) {
	const response = await fetch(this.apiURL + "/chat/request/response", {
	    method: "POST",
	    body: JSON.stringify({
    	        session_token: session_token,
                email: email,
                accept: accept
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("chat_request_response error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
  async chat_user_list(session_token) {
	const response = await fetch(this.apiURL + "/chat/user/list", {
	    method: "POST",
	    body: JSON.stringify({
    	        session_token: session_token,
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("chat_user_list error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.chat_users;
    }
    
  async chat_create(session_token, recipients, text) {
	const response = await fetch(this.apiURL + "/chat/create", {
	    method: "POST",
	    body: JSON.stringify({
    	        session_token: session_token,
                recipients: recipients,
                text: text
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("chat_create error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
  async chat_list(session_token) {
	const response = await fetch(this.apiURL + "/chat/list", {
	    method: "POST",
	    body: JSON.stringify({
    	        session_token: session_token,
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("chat_list error: " + error)
            return null
        });
        const response_json = await response.json();
	this.message = response_json.message;
	return response_json.chats;
    }
    
    async device_list(session_token) {
        const response_json = await this.fetch_json(this.apiURL + "/device/list", {
	    method: "POST",
	    body: JSON.stringify({
    	        session_token: session_token,
	    }),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
	this.message = response_json.message;
	return response_json.devices;
    }
    
    async device_update(session_token, uid, acl_id) {
        var body = {
            session_token: session_token,
            uid: "" + uid
        }
        if (acl_id != null) {
            body["acl_id"] = "" + acl_id
        }
        const response = await fetch(this.apiURL + "/device/update", {
	    method: "POST",
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	}).catch(function (error) {
            console.log("device_update error: " + error)
            return null
        });
	const response_json = await response.json();
	this.message = response_json.message;
	return response_json.success;
    }
    
}
