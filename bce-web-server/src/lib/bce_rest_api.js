export default class BceRestApi {
    
    constructor() {
	this.apiURL = "https://bce.center:8000";
	this.message = "";
    }
    
    async fetch_json_with_options(name, options) {
        return await fetch(this.apiURL + name, options).then((response) => {
            if (response.ok) {
                return response.json();
            }
            console.log("fetch_json_with_options ERROR: name = \"" + name + "\"")
            return null
        }).then((responseJson) => {
            return responseJson
        }).catch((error) => {
            console.log("fetch_json_with_options ERROR: name = \"" + name + "\"  error = \"" + error + "\"")
            return null
        });
    }

    async fetch_json(name, method, body) {
        return await this.fetch_json_with_options(name, {
	    method: method,
	    body: JSON.stringify(body),
	    headers: {
		"Content-type": "application/json; charset=UTF-8"
	    }
	});
    }
    
    async root() {
        const response_json = await this.fetch_json("/", "GET", {});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json;
    }
    
    async generate(ipd) {
        const response_json = await this.fetch_json("/generate?" + new URLSearchParams({ipd: ipd}), "GET", {});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.model_url;
    }
    
    async options() {
        const response_json = await this.fetch_json("/options", "GET", {});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.options;
    }
    
    async user_create(email, password) {
	const response_json = await this.fetch_json("/user/create", "POST", {
	    email: email,
	    password: password
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.success;
    }
    
    async user_login(email, password) {
	const response_json = await this.fetch_json("/user/login", "POST", {
	    email: email,
	    password: password
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.session_token;
    }
    
    async session_valid(session_token) {
	const response_json = await this.fetch_json("/session/valid", "POST", {
	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.session_token_is_valid;
    }
    
    async session_security_level(session_token) {
        const response_json = await this.fetch_json("/session/security_level", "POST", {
	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.security_level;
    }
    
    async session_color_theme(session_token) {
	const response_json = await this.fetch_json("/session/color_theme", "POST", {
  	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.color_theme;
    }
    
    async session_language(session_token) {
	const response_json = await this.fetch_json("/session/language", "POST", {
  	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.language;
    }
    
    async session_rx_editor_state(session_token) {
	const response_json = await this.fetch_json("/session/rx_editor_state", "POST", {
  	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.rx_editor_state;
    }
    
    async session_update(session_token, payload) {
        var color_theme = null;
        var language = null;
        var rx_editor_state = null;
        if ("color_theme" in payload) {
            color_theme = payload.color_theme;
        }
        if ("language" in payload) {
            language = payload.language;
        }
        if ("rx_editor_state" in payload) {
            rx_editor_state = payload.rx_editor_state;
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
        if (rx_editor_state != null) {
            body["rx_editor_state"] = rx_editor_state;
        }
	const response_json = await this.fetch_json("/session/update", "POST", body);
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_create(session_token, display_name) {
	const response_json = await this.fetch_json("/acl/create", "POST", {
  	    session_token: session_token,
            display_name: display_name
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.success;
    }
    
    async acl_delete(session_token, acl_id) {
	const response_json = await this.fetch_json("/acl/delete", "POST", {
 	    session_token: session_token,
            acl_id: acl_id
	});
	if (response_json == null) {
	    return null;
	}
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
        const response_json = await this.fetch_json("/acl/update", "POST", body);
	if (response_json == null) {
	    return null;
	}
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
        const response_json = await this.fetch_json("/acl/list", "POST", body);
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.acls;
    }
    
    async product_list(session_token) {
	const response_json = await this.fetch_json("/product/list", "POST", {
	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.products;
    }
    
  async product_create(session_token, name, display_name, url, quantity, sale_price) {
	const response_json = await this.fetch_json("/product/create", "POST", {
  	    session_token: session_token,
            name: name,
            display_name: display_name,
            url: url,
            quantity: quantity,
            sale_price: sale_price
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.success;
    }
    
    async product_delete(session_token, product_id) {
	const response_json = await this.fetch_json("/product/delete", "POST", {
  	    session_token: session_token,
            product_id: product_id
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.success;
    }
    
    async product_ingest(session_token) {
	const response_json = await this.fetch_json("/product/ingest", "POST", {
  	    session_token: session_token
	});
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.success;
    }

    async asset_upload(session_token, acl_id, file, file_name) {
        var data = new FormData();
        data.append("session_token", session_token);
        data.append("acl_id", Number(acl_id));
        data.append("file", file, file_name);
        const response_json = await this.fetch_json_with_options("/asset/upload", {
            method: 'POST',
            body: data
        });
	if (response_json == null) {
	    return null;
	}
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
        const response_json = await this.fetch_json("/asset/count", "POST", body);
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.count;
    }
  
  async asset_list(session_token, page = 1, page_size = 50, acl_id = null) {
        var body = {
  	    session_token: session_token
	}
        if (acl_id) {
            body["acl_id"] = acl_id;
        }
        if (page) {
            body["page"] = page;
        }
        if (page_size) {
            body["page_size"] = page_size;
        }
        const response_json = await this.fetch_json("/asset/list", "POST", body);
	if (response_json == null) {
	    return null;
	}
	this.message = response_json.message;
	return response_json.assets;
    }
  
    async chat_request(session_token, user_email) {
	const response_json = await this.fetch_json("/chat/request", "POST", {
	    session_token: session_token,
            user_email: user_email
	});
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.success;
    }
    
    async chat_request_list(session_token) {
	const response_json = await this.fetch_json("/chat/request/list", "POST", {
  	    session_token: session_token,
	});
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.chat_requests;
    }
    
  async chat_request_response(session_token, email, accept) {
	const response_json = await this.fetch_json("/chat/request/response", "POST", {
    	    session_token: session_token,
            email: email,
            accept: accept
	});
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.success;
    }
    
    async chat_user_list(session_token) {
	const response_json = await this.fetch_json("/chat/user/list", "POST", {
    	    session_token: session_token,
	});
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.chat_users;
    }
    
    async chat_create(session_token, recipients, text) {
	const response_json = await this.fetch_json("/chat/create", "POST", {
    	    session_token: session_token,
            recipients: recipients,
            text: text
	});
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.success;
    }
    
    async chat_list(session_token) {
	const response_json = await this.fetch_json("/chat/list", "POST", {
    	    session_token: session_token,
	});
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.chats;
    }
    
    async device_list(session_token) {
        const response_json = await this.fetch_json("/device/list", "POST", {
    	    session_token: session_token,
	});
	if (response_json == null) {
	    return null;
	}
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
        const response_json = await this.fetch_json("/device/update", "POST", body);
	if (response_json == null) {
	    return null;
	}
        this.message = response_json.message;
	return response_json.success;
    }
    
}
