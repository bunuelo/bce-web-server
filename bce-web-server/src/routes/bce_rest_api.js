export default class BceRestApi {
    
    constructor() {
	this.apiURL = "http://64.23.144.229:8000";
	this.message = "";
	this.model_reload_count = 0;
    }
    
    async root() {
	const response = await fetch(this.apiURL + "/");
	const response_json = await response.json();
	this.message = response_json.message
	return response_json;
    }
    
    async generate(ipd) {
	const response = await fetch(this.apiURL + "/generate?" + new URLSearchParams({
	    ipd: ipd
	}));
	const response_json = await response.json();
	this.message = response_json.message + "  (sent ipd=" + ipd + ")"
	let current_model_url = response_json.model_url + "?v=" + this.model_reload_count
	this.model_reload_count += 1
	return current_model_url;
    }
    
    async options() {
	const response = await fetch(this.apiURL + "/options");
	const response_json = await response.json();
	this.message = response_json.message;

	return response_json.options;
    }
    
    
}
