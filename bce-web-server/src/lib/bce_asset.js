import { get } from 'svelte/store'
import { user_session_token } from './bce_stores.js'
import BceSession from "$lib/bce_session.js";
let bce_session = new BceSession();

async function fetch_asset(name) {
    bce_session.update_session_from_cookie();
    var url = "https://bce.center:8000/asset/download?session_token=" + get(user_session_token) + "&name=" + name;
    return await fetch(url, {
        "method": "GET",
	"headers": {
	    "Content-type": "application/json; charset=UTF-8"
	}
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        console.log("fetch_evaluation ERROR: response not ok.")
        return null
    }).then((responseJson) => {
        return responseJson
    }).catch((error) => {
        console.log("fetch_evaluation ERROR: error = \"" + error + "\"")
        return null
    });
}

export let bce_asset = {
    fetch_asset: fetch_asset
};
