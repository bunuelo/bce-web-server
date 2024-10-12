
async function fetch_asset(name) {
    var url = "https://bce.center:8000/asset/download?session_token=" + $user_session_token + "&name=" + name;
    evaluation = await fetch_evaluation(url);
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
