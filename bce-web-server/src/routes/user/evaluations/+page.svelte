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
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    
    let selected_asset = null;
    let minimize = true;

    let evaluation = null;
    
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
            console.log("fetch_evaluation ERROR: response not ok.")
            return null
        }).then((responseJson) => {
            return responseJson
        }).catch((error) => {
            console.log("fetch_evaluation ERROR: error = \"" + error + "\"")
            return null
        });
    }
    
    let left_eye_canvas;
    var left_eye_canvas_ctx = null;
    
    let right_eye_canvas;
    var right_eye_canvas_ctx = null;

    var color_background = [0, 0, 0];
    var color_axes       = [63, 63, 63];
    var color_can_see    = [191, 191, 191];
    var color_cannot_see = [31, 31, 31];
    
    function update_eye(canvas, ctx, eye_index) {
        console.log("update_eye: beginning.  eye_index = " + eye_index);

        const center_x             = 0.5 * canvas.width;
        const center_y             = 0.5 * canvas.height;
        const maximum_alpha_radius = 0.5 * canvas.height - 1;
        
        const maximum_alpha = 45;
        const alpha_resolution = 5;

        // background
        ctx.fillStyle = "rgb(" + color_background[0] + "," + color_background[1] + "," + color_background[2] + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // axes
        ctx.strokeStyle = "rgb(" + color_axes[0] + "," + color_axes[1] + "," + color_axes[2] + ")";
        ctx.fillStyle   = "rgb(" + color_axes[0] + "," + color_axes[1] + "," + color_axes[2] + ")";
        ctx.beginPath();
        ctx.arc(center_x, center_y, 1, 0, 2 * Math.PI);
        ctx.fill();
        for (let alpha = alpha_resolution; alpha <= maximum_alpha; alpha += alpha_resolution) {
            ctx.beginPath();
            ctx.arc(center_x, center_y, maximum_alpha_radius * alpha / maximum_alpha, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // can/cannot see stimilus responses
        if (evaluation != null) {
            for (var response_i = 0; response_i < evaluation.responses.length; response_i ++) {
                const response = evaluation.responses[response_i];
                if (response.stimulus.eye == eye_index) {
                    if (response.canSee != null) {
                        const response_alpha           = response.stimulus.direction.alpha * 180.0 / Math.PI;
                        const response_omega           = response.stimulus.direction.omega * 180.0 / Math.PI;
                        const response_radius          = 0.5 * response.stimulus.diameter * 180.0 / Math.PI;
                        const response_radial_distance = maximum_alpha_radius * response_alpha / maximum_alpha;
                        console.log("response_alpha = " + response_alpha + ", response_omega = " + response_omega + ", response_radius = " + response_radius);
                        if (response.canSee) {
                            ctx.fillStyle = "rgb(" + color_can_see[0] + "," + color_can_see[1] + "," + color_can_see[2] + ")";
                            ctx.beginPath();
                            ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
                                    center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
                                    maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
                            ctx.fill();
                        } else {
                            ctx.fillStyle = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
                            ctx.strokeStyle = "rgb(" + color_can_see[0] + "," + color_can_see[1] + "," + color_can_see[2] + ")";
                            ctx.beginPath();
                            ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
                                    center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
                                    maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
                            ctx.fill();
                            ctx.stroke();
                        }
                    }
                }
            }
        }
        
        console.log("update_eye: success!  eye_index = " + eye_index);
    }
    
    function update_eye_canvases() {
        if (left_eye_canvas_ctx == null) {
            left_eye_canvas_ctx  = left_eye_canvas.getContext("2d");
            right_eye_canvas_ctx = right_eye_canvas.getContext("2d");
        }
        const color_theme = $user_color_theme;
        if (color_theme == "dark") {
            color_background = [0, 0, 0];
            color_axes       = [63, 63, 63];
            color_can_see    = [191, 191, 191];
            color_cannot_see = [31, 31, 31];
        } else {
            color_background = [255, 255, 255];
            color_axes       = [191, 191, 191];
            color_can_see    = [63, 63, 63];
            color_cannot_see = [223, 223, 223];
        }

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
            var url = "https://bce.center:8000/asset/download?session_token=" + $user_session_token + "&name=" + asset.name;
            evaluation = await fetch_evaluation(url);
        }
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
    });

    async function update_all() {
        update_eye_canvases();
    }

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

    <table>
        <tr>
            <td>
                Left Eye
            </td>
            <td>
                Right Eye
            </td>
        </tr>
        <tr>
            <td>
                <canvas bind:this={left_eye_canvas} width="400" height="400"></canvas>
            </td>
            <td>
                <canvas bind:this={right_eye_canvas} width="400" height="400"></canvas>
            </td>
        </tr>
    </table>
    
<!--
a comment
/!-->

    <textarea rows="20" cols="50" >
evaluation = {JSON.stringify(evaluation, null, 4)}
    </textarea>

{/if}


