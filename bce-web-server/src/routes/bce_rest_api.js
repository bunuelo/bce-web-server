export default class BceRestApi {
    
    constructor() {
	this.apiURL = "http://64.23.144.229:8000";
    }
    
    async root() {
	const response = await fetch(this.apiURL + "/");
	const response_json = await response.json();
	bce_rest_api_message = response_json.message
	return response_json;
    }
    
    async generate(ipd) {
	const response = await fetch(this.apiURL + "/generate?" + new URLSearchParams({
	    ipd: ipd
	}));
	const response_json = await response.json();
	bce_rest_api_message = response_json.message + "  (sent ipd=" + ipd + ")"
	current_model_url = response_json.model_url + "?v=" + model_reload_count
	model_reload_count += 1
	return response_json;
    }
    
    async options() {
	const response = await fetch(this.apiURL + "/options");
	const response_json = await response.json();
	bce_rest_api_message = response_json.message;
	ipd = response_json.options.ipd.default;
	options = response_json.options;
	sbc = options.sbc.default;
	display = options.display.default;
	lens = options.lens.default;
	front_camera = options.front_camera.default;
	eye_camera = options.eye_camera.default;
	return response_json;
    }
    
    
}
