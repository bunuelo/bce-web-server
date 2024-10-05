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
    
    function update_eye(canvas, ctx, eye_index) {
        console.log("update_eye: beginning.  eye_index = " + eye_index);
        
        const maximum_alpha = 45;
        const alpha_resolution = 5;
        ctx.strokeStyle = "rgb(" + color_axes[0] + "," + color_axes[1] + "," + color_axes[2] + ")";
        ctx.fillStyle   = "rgb(" + color_axes[0] + "," + color_axes[1] + "," + color_axes[2] + ")";
        ctx.beginPath();
        ctx.arc(0.5 * canvas.width, 0.5 * canvas.height, 1, 0, 2 * Math.PI);
        ctx.fill();
        for (let alpha = alpha_resolution; alpha <= maximum_alpha; alpha += alpha_resolution) {
            ctx.beginPath();
            ctx.arc(0.5 * canvas.width, 0.5 * canvas.height, (0.5 * canvas.height - 1) * alpha / maximum_alpha, 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        if (evaluation != null) {
            for (var response_i = 0; response_i < evaluation.responses.length; response_i ++) {
                const response = evaluation.responses[response_i];
                if (response.canSee != null) {
                    if (response.canSee) {
                        const response_alpha = response.stimulus.direction.alpha * 180.0 / Math.PI;
                        const response_omega = response.stimulus.direction.omega * 180.0 / Math.PI;
                        const response_radius = 0.5 * response.stimulus.direction.diameter * 180.0 / Math.PI;
                        console.log("response_alpha = " + response_alpha + ", response_omega = " + response_omega + ", response_radius = " + response_radius);
                        
                    }
                }
            }
        }
        
        //const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        //for (let p = 0; p < imageData.data.length; p += 4) {
	//    const i = p / 4;
	//    const ix = i % canvas.width;
	//    const iy = (i / canvas.height) >>> 0;
        //    const x = 2.0 * (ix / (canvas.width - 1)) - 1.0; 
        //    const y = 2.0 * (iy / (canvas.height - 1)) - 1.0;
        //    const radius = Math.sqrt(x*x + y*y);
        //    const alpha = Math.atan2(radius, 1.0) * 180.0 / Math.PI;
        //    const omega = Math.atan2(y, x) * 180.0 / Math.PI;
        //    
	//    var r = color_background[0];
	//    var g = color_background[1];
	//    var b = color_background[2];
        //    
        //    for (let alpha_circle = 0.0; alpha_circle <= 60.0; alpha_circle += 5.0) {
        //        if (alpha >= alpha_circle - 0.3 && alpha <= alpha_circle + 0.3) {
        //            r = color_axes[0];
        //            g = color_axes[1];
        //            b = color_axes[2];
        //        }
        //    }
        //
	//    imageData.data[p + 0] = r;
	//    imageData.data[p + 1] = g;
	//    imageData.data[p + 2] = b;
	//    imageData.data[p + 3] = 255;
        //}
        //ctx.putImageData(imageData, 0, 0);
        
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
        } else {
            color_background = [255, 255, 255];
            color_axes       = [191, 191, 191];
            color_can_see    = [63, 63, 63];
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


