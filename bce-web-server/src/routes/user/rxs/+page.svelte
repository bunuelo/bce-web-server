<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import { zero_pad, format_date, format_time_since_date, format_json_datetime, format_time_since_json_datetime } from '$lib/bce_time.js'
    import { bce_canvas_render__draw_radial_eye } from '$lib/bce_canvas_render.js';
    import { stimrx } from '$lib/stimrx/stimrx.js';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    import StimrxExpressionEditor from '$lib/stimrx/StimrxExpressionEditor.svelte'
    
    let selected_asset = null;
    let minimize = true;

    let rx = stimrx.new_stimrx_sequence_expression([
        stimrx.new_stimrx_set_variable_expression(null, null, "left_eye_lens",  stimrx.new_stimrx_light_projection([])),
        stimrx.new_stimrx_set_variable_expression(null, null, "right_eye_lens", stimrx.new_stimrx_light_projection([])),
    ]);
    
    async function fetch_rx(url) {
        return await fetch(url, {
            "method": "GET",
	    "headers": {
		"Content-type": "application/json; charset=UTF-8"
	    }
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            console.log("fetch_rx ERROR: response not ok.")
            return null
        }).then((responseJson) => {
            return responseJson
        }).catch((error) => {
            console.log("fetch_rx ERROR: error = \"" + error + "\"")
            return null
        });
    }
    
    let show_details = false;
    
    async function on_asset_select(asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
        if (asset == null) {
            rx = null;
        } else {
            var url = "https://bce.center:8000/asset/download?session_token=" + $user_session_token + "&name=" + asset.name;
            rx = await fetch_rx(url);
        }
    };

    const on_window_resize = async function() {
    };
	
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
	window.addEventListener('resize', on_window_resize);
	return () => {
	     window.removeEventListener('resize', on_window_resize);
	}
    });

    async function update_all() {
    }

</script>

<style>
</style>

<svelte:head>
    <title>{bce_lang($user_language, "page_rxs_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_rxs_title")}</h1>
    
    <div>
        <i>{bce_lang($user_language, "page_rxs_label_prescription")}:</i>
        <AssetSelector bind:minimize={minimize} bind:selected_asset={selected_asset} on_asset_select={on_asset_select} />
    </div>
    
    <StimrxExpressionEditor bind:expression={rx}/>
    
<!--
a comment
/!-->

{/if}


