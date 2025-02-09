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
    import StimrxEditor from '$lib/stimrx/StimrxEditor.svelte'
    import StimrxExpressionEditor from '$lib/stimrx/StimrxExpressionEditor.svelte'
    import StimrxLightProjectionEditor from '$lib/stimrx/StimrxLightProjectionEditor.svelte'
    import { bce_asset } from '$lib/bce_asset.js'
    import { bce_sprite } from '$lib/bce_sprite.js'
    
    export let expression;
    export let editor = null;
    export let path = [];
    export let asset_cache;
    export let editor_prescription;
    export let save_prescription_callback;

    let view_selected = "expand";

    let minimize_evaluation_asset_selector = true;
    let selected_evaluation = null;
    
    $: (function () {
        if (editor && view_selected) {
	    stimrx_editor.stimrx_editor__set_meta_var(editor, path, "view_selected", view_selected);
	}
    })();

    onMount(async () => {
        await update_all();
    });

    onDestroy(async function () {
	bce_sprite.remove_all_sprites();
    });

    async function update_all() {
    }
    
    async function on_change_acl_selected() {
    }
    
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
	await save_prescription_callback();
	let temp1 = expression;
	expression = null;
	expression = temp1;
	let temp2 = editor
	editor = null;
	editor = temp2;
    }

    let on_evaluation_asset_select = async function (asset) {
        console.log("Evaluation asset selected: " + asset.name + " (" + asset.file_name + ")");
	minimize_evaluation_asset_selector = true;
	if (editor !== null && expression !== null && stimrx_editor.stimrx_editor_prescription__is_type(expression)) {
	    let rx = expression;
	    let editor_evaluation = stimrx_editor.new_stimrx_editor_evaluation(asset.name);
	    rx.evaluations.push(editor_evaluation);
            await changed_rx_editor_state();
	} else {
	    console.log("Could not find rx to add evaluation.");
	}
    };

    async function on_click_remove_evaluation(evaluation_index) {
	if (stimrx_editor.stimrx_editor_prescription__is_type(expression)) {
	    let rx = expression;
	    rx.evaluations.splice(evaluation_index, 1);
            await changed_rx_editor_state();
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
                            <StimrxExpressionEditor bind:expression={child} bind:editor={editor} path={[...path, "children", i]} bind:asset_cache={asset_cache} bind:editor_prescription={editor_prescription} save_prescription_callback={save_prescription_callback}/>
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
   	                    <StimrxExpressionEditor bind:expression={child} bind:editor={editor} path={[...path, "children", i]} bind:asset_cache={asset_cache} bind:editor_prescription={editor_prescription} save_prescription_callback={save_prescription_callback}/>
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
        <table>
	    <tr>
	        <td>
                    <i>{bce_lang($user_language, "component_stimrx_expression_editor_label_set_variable")}</i>
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
		</td>
	    </tr>
	    <tr>
	        <td>
                    {#if view_selected === "expand"}
                        <StimrxExpressionEditor bind:expression={expression.value} bind:editor={editor} path={[...path, "value"]} bind:asset_cache={asset_cache} bind:editor_prescription={editor_prescription} save_prescription_callback={save_prescription_callback}/>
                    {/if}
		</td>
	    </tr>
	</table>
    {:else if stimrx_editor.stimrx_editor_prescription__is_type(expression)}
        <i>{bce_lang($user_language, "component_stimrx_expression_editor_label_prescription")}</i>
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
        <table>
            <tr>
	        <td>
       	            <i>{bce_lang($user_language, "component_stimrx_expression_editor_label_patient_user")}</i>: {expression.user_id}
		</td>
            </tr>
            <tr>
	        <td>
	            <a href="#" on:click|preventDefault={on_click_add_evaluation}>
         	        {bce_lang($user_language, "component_stimrx_expression_editor_label_add_evaluation")}
	            </a>
		</td>
            </tr>
	    {#each expression.evaluations as evaluation, j}
	        <tr>
	            <td>
	                {#await get_json_asset(evaluation.asset_name)}
	                    Loading evaluation...
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
        {#if view_selected === "expand"}
            <StimrxExpressionEditor bind:expression={expression.expression} bind:editor={editor} path={[...path, "expression"]} bind:asset_cache={asset_cache} bind:editor_prescription={expression} save_prescription_callback={save_prescription_callback}/>
        {/if}
    {:else if stimrx.stimrx_light_projection__is_type(expression)}
        <StimrxLightProjectionEditor expression={expression} bind:editor={editor} path={path} bind:asset_cache={asset_cache} bind:editor_prescription={editor_prescription} save_prescription_callback={save_prescription_callback}/>
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
        <StimrxEditor bind:expression={expression} bind:editor={editor} path={path} bind:asset_cache={asset_cache} bind:editor_prescription={editor_prescription}/>
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
