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
    
    let selected_asset = null;
    let minimize = true;

    let rx = null;
    
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
    
    let left_eye_canvas;
    var left_eye_canvas_ctx = null;
    
    let right_eye_canvas;
    var right_eye_canvas_ctx = null;

    let show_details = false;
    
    function update_eye_canvases() {
        if (left_eye_canvas_ctx == null) {
            left_eye_canvas_ctx  = left_eye_canvas.getContext("2d");
            right_eye_canvas_ctx = right_eye_canvas.getContext("2d");
        }
	left_eye_canvas.width   = 0.25 * window.innerWidth;
	left_eye_canvas.height  = 0.25 * window.innerWidth;
	right_eye_canvas.width  = 0.25 * window.innerWidth;
	right_eye_canvas.height = 0.25 * window.innerWidth;
	bce_canvas_render__draw_radial_eye(left_eye_canvas, left_eye_canvas_ctx);
	bce_canvas_render__draw_radial_eye(right_eye_canvas, right_eye_canvas_ctx);
    }
    
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
        update_eye_canvases();
    };

    const on_window_resize = async function() {
        update_eye_canvases();
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
        update_eye_canvases();
    }

    async function on_click_hide_details() {
        show_details = false;
    }
    
    async function on_click_show_details() {
        show_details = true;
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_rxs_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_rxs_title")}</h1>
    
    <i>{bce_lang($user_language, "page_rxs_label_prescription")}:</i>
    <AssetSelector bind:minimize={minimize} bind:selected_asset={selected_asset} on_asset_select={on_asset_select} />
    
    <table>
        <tr>
            <td>
                {bce_lang($user_language, "page_rxs_label_left_eye")}
            </td>
            <td>
                {bce_lang($user_language, "page_rxs_label_right_eye")}
            </td>
        </tr>
        <tr>
            <td>
                <canvas bind:this={left_eye_canvas}></canvas>
            </td>
            <td>
                <canvas bind:this={right_eye_canvas}></canvas>
            </td>
        </tr>
    </table>
    
<!--
a comment
/!-->

    <table>
        <tr>
            <td>
                {#if show_details}
                    <a href="#" on:click|preventDefault={on_click_hide_details}>
                        {bce_lang($user_language, "page_rxs_label_hide_details")}
                    </a>
                {:else}
                    <a href="#" on:click|preventDefault={on_click_show_details}>
                        {bce_lang($user_language, "page_rxs_label_show_details")}
                    </a>
                {/if}
            </td>
        </tr>
        {#if show_details}
            <tr>
                <td>
                    <textarea rows="20" cols="50" >
rx = {JSON.stringify(rx, null, 4)}
                    </textarea>
                </td>
            </tr>
        {/if}
    </table>
{/if}


