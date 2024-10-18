<script>
    import { onMount } from 'svelte';
    import { onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import { zero_pad, format_date, format_time_since_date, format_json_datetime, format_time_since_json_datetime } from '$lib/bce_time.js'
    import { bce_canvas_render } from '$lib/bce_canvas_render.js';
    import { stimrx } from '$lib/stimrx/stimrx.js';
    import { stimrx_editor } from '$lib/stimrx/stimrx_editor.js';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    import StimrxExpressionEditor from '$lib/stimrx/StimrxExpressionEditor.svelte'
    import StimrxLightProjectionEditor from '$lib/stimrx/StimrxLightProjectionEditor.svelte'
    import { bce_asset } from '$lib/bce_asset.js'
    import { bce_sprite } from '$lib/bce_sprite.js'
    
    export let expression;
    export let editor = null;
    export let path = [];
    export let asset_cache;

    let view_selected = "expand";

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

    onDestroy(async function () {
	bce_sprite.remove_all_sprites();
    });

    async function update_all() {
        update_view_selected();
    }
    
    async function update_view_selected() {
    }

    // This function is a backup.  It is not used and a better method is used below instead.
    var cumulative_element_offset = function(element) {
	var top = 0, left = 0;
	do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
	} while(element);
	return {
            top: top,
            left: left
	};
    };

    async function get_json_asset(name) {
	if (! (name in asset_cache)) {
	    let fetched_asset = await bce_asset.fetch_asset(name);
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
	minimize_evaluation_asset_selector = false;
    }

    async function upload_rx_editor_state() {
	await bce_session.update({"rx_editor_state": JSON.stringify(editor)});
    }
    
    async function changed_rx_editor_state() {
	await upload_rx_editor_state();
	let temp1 = expression;
	expression = null;
	expression = temp1;
	let temp2 = editor
	editor = null;
	editor = temp2;
    }

    let on_evaluation_asset_select = async function (asset) {
        console.log("Evaluation asset selected: " + asset.name + " (" + asset.file_name + ")");
	if (editor !== null) {
	    let editor_evaluation = stimrx_editor.new_stimrx_editor_evaluation(asset.name);
	    editor.rxs[0].evaluations.push(editor_evaluation);
            await changed_rx_editor_state();
	}
	minimize_evaluation_asset_selector = true;
    };

    async function on_click_remove_evaluation(evaluation_index) {
	editor.rxs[0].evaluations.splice(evaluation_index, 1);
        await changed_rx_editor_state();
    }
  
    async function on_click_remove_blind_spot(eye_index, blind_spot_index) {
        console.log("remove blind spot clicked.");
	if (eye_index == 0) {
	    let blind_spot = editor.rxs[0].left_eye_blind_spots[blind_spot_index];
	    let blind_spot_canvas = bce_sprite.get_sprite_canvas(blind_spot.canvas_id);
	    blind_spot_canvas.remove();
	    editor.rxs[0].left_eye_blind_spots.splice(blind_spot_index, 1);
            await changed_rx_editor_state();
	} else if (eye_index == 1) {
	    let blind_spot = editor.rxs[0].right_eye_blind_spots[blind_spot_index];
	    let blind_spot_canvas = bce_sprite.get_sprite_canvas(blind_spot.canvas_id);
	    blind_spot_canvas.remove();
	    editor.rxs[0].right_eye_blind_spots.splice(blind_spot_index, 1);
            await changed_rx_editor_state();
	} else {
	    console.log("invalid eye index.");
	}
    }
  
    async function on_click_edit_blind_spot(eye_index, blind_spot_index) {
        console.log("remove blind spot clicked.");
	var blind_spot;
	if (eye_index == 0) {
	    blind_spot = editor.rxs[0].left_eye_blind_spots[blind_spot_index];
	} else if (eye_index == 1) {
	    blind_spot = editor.rxs[0].right_eye_blind_spots[blind_spot_index];
	} else {
	    console.log("invalid eye index.");
	    return;
	}
	blind_spot.edit = !blind_spot.edit;
	bce_sprite.bring_sprite_to_front(blind_spot.canvas_id);
	for (var j = 0; j < blind_spot.points.length; j ++) {
	    bce_sprite.bring_sprite_to_front(blind_spot.canvas_id + "_" + j);
	}
	await changed_rx_editor_state();
    }
  
    async function on_click_add_blind_spot() {
        console.log("add blind spot clicked.");
	if (editor !== null) {
	    if (stimrx.stimrx_left_eye_light_projection__is_type(expression)) {
		let editor_blind_spot = stimrx_editor.new_default_left_eye_stimrx_editor_blind_spot(editor);
		editor.rxs[0].left_eye_blind_spots.push(editor_blind_spot);
		await changed_rx_editor_state();
		console.log("added blind spot to left eye.");
	    } else if (stimrx.stimrx_right_eye_light_projection__is_type(expression)) {
		let editor_blind_spot = stimrx_editor.new_default_right_eye_stimrx_editor_blind_spot(editor);
		editor.rxs[0].right_eye_blind_spots.push(editor_blind_spot);
		await changed_rx_editor_state();
		console.log("added blind spot to right eye.");
	    }
	}
    }
				
</script>

<style>
    div.stimrx_expression {
        display: inline-block;
        vertical-align: top;
        background-color: var(--surface1);
        border: 2px solid var(--surface3);
    }
</style>

<div class="stimrx_expression">
    <AssetSelector bind:minimize={minimize_evaluation_asset_selector} popup_only={true} bind:selected_asset={selected_evaluation} on_asset_select={on_evaluation_asset_select} />
    {#if stimrx.stimrx_sequence_expression__is_type(expression)}
        <i>Sequence</i>
        {#if editor !== null && editor.show_view_options}
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
	{/if}
        {#if view_selected === "expand"}
            <table>
                <tr>
                    <td width="50px">
                    </td>
                    <td>
                        {#each expression.children as child, i}
                            <StimrxExpressionEditor bind:expression={child} editor={editor} path={[...path, "children", i]} bind:asset_cache={asset_cache}/>
    	                {/each}
                    </td>
	        </tr>
	    </table>
        {/if}
    {:else if stimrx.stimrx_select_expression__is_type(expression)}
        <i>Select</i>
        {#if editor !== null && editor.show_view_options}
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
	{/if}
        {#if view_selected === "expand"}
            <table>
                <tr>
                    <td width="50px">
                    </td>
                    <td>
                        {#each expression.children as child, i}
 	                    <StimrxExpressionEditor bind:expression={child} editor={editor} path={[...path, "children", i]} bind:asset_cache={asset_cache}/>
    	                {/each}
                    </td>
	        </tr>
	    </table>
        {/if}
    {:else if stimrx.stimrx_get_variable_expression__is_type(expression)}
        <i>Get Variable</i>
        {#if editor !== null && editor.show_view_options}
            <select bind:value={view_selected}>
                <option value="minimal">
	            {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	        </option>
                <option value="code">
	            {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	        </option>
            </select>
	{/if}
        <tt>{expression.name}</tt>
    {:else if stimrx.stimrx_set_variable_expression__is_type(expression)}
        <i>Set Variable</i>
        {#if editor !== null && editor.show_view_options}
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
	{/if}
        <tt>{expression.name}&nbsp;=&nbsp;</tt>
        {#if view_selected === "expand"}
            <td>
                <StimrxExpressionEditor bind:expression={expression.value} editor={editor} path={[...path, "value"]} bind:asset_cache={asset_cache}/>
            </td>
        {/if}
    {:else if stimrx.stimrx_light_projection__is_type(expression)}
        <StimrxLightProjectionEditor expression={expression} editor={editor} path={path} bind:asset_cache={asset_cache}/>
    {:else if Number.isFinite(expression)}
        <i>Number</i>
        {#if editor !== null && editor.show_view_options}
            <select bind:value={view_selected}>
                <option value="minimal">
	            {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	        </option>
                <option value="code">
	            {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	        </option>
            </select>
	{/if}
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
			{#each editor.rxs[0].evaluations as evaluation, j}
		            <tr>
	                        <td>
	                            {#await get_json_asset(evaluation.asset_name)}
	                                ...waiting
	                            {:then json_asset}
	                                {bce_lang($user_language, "component_stimrx_expression_editor_label_evaluation")}&nbsp;{j + 1}
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
                        <StimrxExpressionEditor expression={expression.rxs[0].expression} editor={expression} path={[...path, "rxs", 0, "expression"]} bind:asset_cache={asset_cache}/>
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
