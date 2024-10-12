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
    import { stimrx_editor } from '$lib/stimrx/stimrx_editor.js';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    import StimrxExpressionEditor from '$lib/stimrx/StimrxExpressionEditor.svelte'
    import { bce_asset } from '$lib/bce_asset.js'
    
    export let expression;
    export let editor = null;
    export let path = [];
    export let asset_cache;

    let view_selected = editor ? stimrx_editor.stimrx_editor__get_meta_var(editor, path, "view_selected") : null;
    let light_projection_canvas;

    let minimize_evaluation_asset_selector = true;
    let selected_evaluation = null;

    $: (function () {
        if (editor && view_selected) {
	    stimrx_editor.stimrx_editor__set_meta_var(editor, path, "view_selected", view_selected);
	}
    })();

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
        update_view_selected();
    }

    async function update_view_selected() {
    }

    $: (function () {
	if (light_projection_canvas != null) {
	    light_projection_canvas.width = 0.25 * window.innerWidth;
	    light_projection_canvas.height = 0.25 * window.innerWidth;
	    let ctx = light_projection_canvas.getContext("2d");
   	    bce_canvas_render__draw_radial_eye(light_projection_canvas, ctx);
	}
    })();

    async function get_json_asset(name) {
	console.log("get_json_asset: name = \"" + name + "\"");
	if (! (name in asset_cache)) {
	    console.log("fetching asset.");
	    let fetched_asset = await bce_asset.fetch_asset(name);
	    console.log("fetched asset = " + JSON.stringify(fetched_asset));
	    asset_cache[name] = fetched_asset;
	}
	return asset_cache[name];
    }

    async function on_click_hide_details() {
        show_details = false;
    }
    
    async function on_click_show_details() {
        show_details = true;
    }
    
    async function on_click_hide_more_details() {
        show_more_details = false;
    }
    
    async function on_click_show_more_details() {
        show_more_details = true;
    }

    async function on_click_add_evaluation() {
	console.log("In the process of adding evaluation.");
	minimize_evaluation_asset_selector = false;
    }

    async function upload_rx_editor_state() {
	await bce_session.update({"rx_editor_state": JSON.stringify(editor)});
    }

    async function changed_rx_editor_state() {
	await upload_rx_editor_state();
	let temp = expression;
	expression = null;
	expression = temp;
    }

    let on_evaluation_asset_select = async function (asset) {
        console.log("Evaluation asset selected: " + asset.name + " (" + asset.file_name + ")");
	if (editor !== null) {
            //console.log("Fetching evaluation asset.");
            //let evaluation = await bce_asset.fetch_asset(asset.name);
            //console.log("Received evaluation asset.  evaluation=" + evaluation);
	    editor.evaluations.push(asset.name);
            await changed_rx_editor_state();
	}
	minimize_evaluation_asset_selector = true;
    };

    async function on_click_remove_evaluation(evaluation_index) {
	editor.evaluations.splice(evaluation_index, 1);
        await changed_rx_editor_state();
    }

</script>

<style>
    div.stimrxExpression {
        display: inline-block;
        vertical-align: top;
        background-color: var(--surface1);
        border: 2px solid var(--surface3);
    }
</style>

<div class="stimrxExpression">
    <AssetSelector bind:minimize={minimize_evaluation_asset_selector} popup_only={true} bind:selected_asset={selected_evaluation} on_asset_select={on_evaluation_asset_select} />
    {#if stimrx.stimrx_sequence_expression__is_type(expression)}
        <i>Sequence</i>
        <select bind:value={view_selected}>
            <option value="expand">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	    </option>
            <option value="minimal">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	    </option>
            <option value="code">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	    </option>
        </select>
        {#if view_selected === "expand"}
            <table>
                <tr>
                    <td width="50px">
                    </td>
                    <td>
                        {#each expression.children as child, i}
	                    <StimrxExpressionEditor bind:expression={child} editor={editor} path={[...path, "children", i]} asset_cache={asset_cache}/>
    	                {/each}
                    </td>
	        </tr>
	    </table>
        {/if}
    {:else if stimrx.stimrx_select_expression__is_type(expression)}
        <i>Select</i>
        <select bind:value={view_selected}>
            <option value="expand">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	    </option>
            <option value="minimal">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	    </option>
            <option value="code">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	    </option>
        </select>
        {#if view_selected === "expand"}
            <table>
                <tr>
                    <td width="50px">
                    </td>
                    <td>
                        {#each expression.children as child, i}
	 <StimrxExpressionEditor bind:expression={child} editor={editor} path={[...path, "children", i]} asset_cache={asset_cache}/>
    	                {/each}
                    </td>
	        </tr>
	    </table>
        {/if}
    {:else if stimrx.stimrx_get_variable_expression__is_type(expression)}
        <i>Get Variable</i>
        <select bind:value={view_selected}>
            <option value="minimal">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	    </option>
            <option value="code">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	    </option>
        </select>
        <tt>{expression.name}</tt>
    {:else if stimrx.stimrx_set_variable_expression__is_type(expression)}
        <i>Set Variable</i>
        <select bind:value={view_selected}>
            <option value="expand">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	    </option>
            <option value="minimal">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	    </option>
            <option value="code">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	    </option>
        </select>
        <tt>{expression.name}&nbsp;=&nbsp;</tt>
        {#if view_selected === "expand"}
            <td>
                <StimrxExpressionEditor bind:expression={expression.value} editor={editor} path={[...path, "value"]} asset_cache={asset_cache}/>
            </td>
        {/if}
    {:else if stimrx.stimrx_light_projection__is_type(expression)}
        <table>
	    <tr>
	        <td>
                    {#if stimrx.stimrx_left_eye_light_projection__is_type(expression)}
                        <i>Left Eye Light Projection</i>
                    {:else if stimrx.stimrx_right_eye_light_projection__is_type(expression)}
                        <i>Right Eye Light Projection</i>
                    {:else}
                        <i>Light Projection</i>
                    {/if}
                    <select bind:value={view_selected}>
                        <option value="expand">
	                    {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	                </option>
                        <option value="minimal">
	                    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	                </option>
                        <option value="code">
	                    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	                </option>
                    </select>
                </td>
            </tr>
            {#if view_selected === "expand"}
                {#if editor !== null}
                    <tr>
	                <td>
                            Evaluations:
  	                    {#each editor.evaluations as evaluation, j}
         	                <input type="checkbox" id={"" + path + j}>
			        <label for={"" + path + j}>Evaluation {j}</label>
	                    {/each}
	                </td>
	            </tr>
		{/if}
                <tr>
	            <td>
                        <canvas bind:this={light_projection_canvas}></canvas>
	            </td>
	        </tr>
	    {/if}
        </table>
    {:else if Number.isFinite(expression)}
        <i>Number</i>
        <select bind:value={view_selected}>
            <option value="minimal">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	    </option>
            <option value="code">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	    </option>
        </select>
        <table>
            <tr>
	        <td width="50px">
	        </td>
	        <td>
	        </td>
	    </tr>
            <tr>
	        <td>
	        </td>
	        <td>
	            <tt>{expression}</tt>
	        </td>
	    </tr>
        </table>
    {:else if stimrx_editor.stimrx_editor__is_type(expression)}
        <table>
	    <tr>
	        <td>
                    <i>Prescription Editor</i>
		    <a href="#" on:click|preventDefault={on_click_add_evaluation}>
	                {bce_lang($user_language, "component_stimrx_expression_editor_label_add_evaluation")}
		    </a> 
                </td>
            </tr>
	    <tr>
	        <td>
  	            <table>
			{#each editor.evaluations as evaluation, j}
		            <tr>
	                        <td>
	                            {#await get_json_asset(evaluation)}
	                                ...waiting
	                            {:then json_asset}
	                                {bce_lang($user_language, "component_stimrx_expression_editor_label_evaluation")}&nbsp;{json_asset.type}
 	                            {:catch error}
	                                {error.message}
	                            {/await}
	                            <a href="#" on:click|preventDefault={async function () {await on_click_remove_evaluation(j);}}>
	                                {bce_lang($user_language, "component_stimrx_expression_editor_label_remove_evaluation")}
	                            </a>
		                </td>
		            </tr>
	                {/each}
		    </table>
		</td>
	    </tr>
            <tr>
                <td>
		    {#if expression.rxs.length > 0}
                        <StimrxExpressionEditor expression={expression.rxs[0]} editor={expression} path={[...path, "rxs", 0]} asset_cache={asset_cache}/>
                    {/if}
                </td>
            </tr>
        </table>
    {:else}
        <select bind:value={view_selected}>
            <option value="minimal">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	    </option>
            <option value="code">
	        {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	    </option>
        </select>
        <table>
            <tr>
	        <td>
	            <i>Unknown StimrxExpression type</i>
	        </td>
	    </tr>
        </table>
    {/if}
    {#if view_selected === "code"}
        <textarea rows="20" cols="50" >
{path}
{JSON.stringify(expression, null, 4)}
        </textarea>
    {/if}
</div>
