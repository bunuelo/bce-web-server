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
            console.log("fetch_evaluation ERROR: response not ok.")
            return null
        }).then((responseJson) => {
            return responseJson
        }).catch((error) => {
            console.log("fetch_evaluation ERROR: error = \"" + error + "\"")
            return null
        });
    }
    
    let left_retina_canvas;
    var left_retina_canvas_ctx = null;
    
    let right_retina_canvas;
    var right_retina_canvas_ctx = null;

    function update_eye(eye_index) {
        if (eye_index == 0) {
            var canvas = left_retina_canvas;
            var ctx = left_retina_canvas_ctx;
        } else {
            var canvas = right_retina_canvas;
            var ctx = right_retina_canvas_ctx;
        }
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
        for (let p = 0; p < imageData.data.length; p += 4) {
	    const i = p / 4;
	    const x = i % canvas.width;
	    const y = (i / canvas.height) >>> 0;
            
	    const t = window.performance.now();
            
	    const r = 64 + (128 * x) / canvas.width + 64 * Math.sin(t / 1000);
	    const g = 64 + (128 * y) / canvas.height + 64 * Math.cos(t / 1400);
	    const b = 128;
            
	    imageData.data[p + 0] = r;
	    imageData.data[p + 1] = g;
	    imageData.data[p + 2] = b;
	    imageData.data[p + 3] = 255;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }
    
    function update_retina_canvases() {
        if (left_retina_canvas_ctx == null) {
            left_retina_canvas_ctx  = left_retina_canvas.getContext("2d");
            right_retina_canvas_ctx = right_retina_canvas.getContext("2d");
        }
        update_eye(0)
        update_eye(1)
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
        update_retina_canvases();
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

    <table>
        <tr>
            <td>
                Left Retina
            </td>
            <td>
                Right Retina
            </td>
        </tr>
        <tr>
            <td>
                <canvas bind:this={left_retina_canvas} width="400" height="400"></canvas>
            </td>
            <td>
                <canvas bind:this={right_retina_canvas} width="400" height="400"></canvas>
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


