<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import { zero_pad, format_date, format_time_since_date, format_json_datetime, format_time_since_json_datetime } from '$lib/bce_time.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 25) {
            goto("/user/dashboard");
        }
        await update_all();
    });

    async function update_all() {
    }

    let selected_asset = null;
    let minimize = true;

    let evaluation = "";
    
    async function fetch_evaluation(url) {
        return await fetch(url, {
            "method": "GET",
	    "headers": {
		"Content-type": "application/json; charset=UTF-8"
	    }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            console.log("fetch_evaluation ERROR: bad response.")
            return null
        }).then((responseJson) => {
            return responseJson
        }).catch((error) => {
            console.log("fetch_evaluation ERROR: error = \"" + error + "\"")
            return null
        });
    }
    
    async function on_asset_select(asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
        var url = "https://bce.center:8000/asset/download?session_token=" + $user_session_token + "&name=" + asset.name;
        evaluation = await fetch_evaluation(url);
    };

</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_evaluations_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_evaluations_title")}</h1>
  
    <table>
        <tr>
            <td>
                <i>Evaluation:</i>
            </td>
            <td>
                <AssetSelector bind:minimize={minimize} bind:selected_asset={selected_asset} on_asset_select={on_asset_select} />
            </td>
        </tr>
    </table>

    evaluation = {JSON.stringify(evaluation, null, 4)}
    
    <table>
        <tr>
            <td>
                Left Retina
            </td>
            <td>
                Right Retina
            </td>
        </tr>
    </table>
    
{/if}


