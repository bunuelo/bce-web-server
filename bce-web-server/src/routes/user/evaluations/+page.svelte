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
    import { bce_canvas_render__evaluation_eye } from '$lib/bce_canvas_render.js';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte';
    import { bce_asset } from '$lib/bce_asset.js'
    import { stimrx } from '$lib/stimrx/stimrx.js'

    let selected_asset = null;
    let minimize = true;

    let evaluation = null;
    
    let left_eye_canvas;
    var left_eye_canvas_ctx = null;
    
    let right_eye_canvas;
    var right_eye_canvas_ctx = null;

    let left_eye_total_stimulus_count = 0;
    let left_eye_total_response_count = 0;
    let right_eye_total_stimulus_count = 0;
    let right_eye_total_response_count = 0;
    
    let show_details = false;
    
    function update_eye(canvas, ctx, eye_index) {
	let stats = bce_canvas_render__evaluation_eye(canvas, ctx, evaluation, eye_index);
	if (eye_index == 0) {
            left_eye_total_stimulus_count = stats["eye_total_stimulus_count"];
            left_eye_total_response_count = stats["eye_total_response_count"];
	} else {
            right_eye_total_stimulus_count = stats["eye_total_stimulus_count"];
            right_eye_total_response_count = stats["eye_total_response_count"];
	}
        //console.log("update_eye: success!  eye_index = " + eye_index);
    }
    
    function update_eye_canvases() {
        if (left_eye_canvas_ctx == null) {
            left_eye_canvas_ctx  = left_eye_canvas.getContext("2d");
            right_eye_canvas_ctx = right_eye_canvas.getContext("2d");
        }
	left_eye_canvas.width   = 0.25 * window.innerWidth;
	left_eye_canvas.height  = 0.25 * window.innerWidth;
	right_eye_canvas.width  = 0.25 * window.innerWidth;
	right_eye_canvas.height = 0.25 * window.innerWidth;
        update_eye(left_eye_canvas, left_eye_canvas_ctx, 0)
        update_eye(right_eye_canvas, right_eye_canvas_ctx, 1)
    }
    
    async function on_asset_select(asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
        if (asset == null) {
            evaluation = null;
        } else {
	    let loaded_asset = bce_asset.fetch_asset(asset.name);
	    if (! stimrx.stimrx_evaluation__is_type(loaded_asset)) {
		console.log("Loaded asset is not Evaluation.");
		console.log("loaded_asset = " + loaded_asset);
		return;
	    }
	    evaluation = loaded_asset;
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
    <title>{bce_lang($user_language, "page_evaluations_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_evaluations_title")}</h1>
    
    <i>{bce_lang($user_language, "page_evaluations_label_evaluation")}:</i>
    <AssetSelector bind:minimize={minimize} bind:selected_asset={selected_asset} on_asset_select={on_asset_select} />
    
    <table>
        <tr>
            <td>
                {bce_lang($user_language, "page_evaluations_label_left_eye")} ({left_eye_total_response_count} / {left_eye_total_stimulus_count})
            </td>
            <td>
                {bce_lang($user_language, "page_evaluations_label_right_eye")} ({right_eye_total_response_count} / {right_eye_total_stimulus_count})
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
                        {bce_lang($user_language, "page_evaluations_label_hide_details")}
                    </a>
                {:else}
                    <a href="#" on:click|preventDefault={on_click_show_details}>
                        {bce_lang($user_language, "page_evaluations_label_show_details")}
                    </a>
                {/if}
            </td>
        </tr>
        {#if show_details}
            <tr>
                <td>
                    <textarea rows="20" cols="50" >
evaluation = {JSON.stringify(evaluation, null, 4)}
                    </textarea>
                </td>
            </tr>
        {/if}
    </table>
{/if}


