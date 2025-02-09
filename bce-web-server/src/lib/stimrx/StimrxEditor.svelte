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
    export let editor_prescription;

    let view_selected = "expand";

    let acl_list = [];
    let acl_selected = "0";

    let minimize_prescription_asset_selector = true;
    let selected_prescription = null;
    
    let patient_user_list = [];
    let patient_user_selected = ""
    
    async function on_click_open_prescription() {
	minimize_prescription_asset_selector = false;
    }

    function get_acl_by_id(acl_id) {
        for (var i = 0; i < acl_list.length; i ++) {
            let acl = acl_list[i]
            if (acl.acl_id == acl_id) {
                return acl
            }
        }
        return null
    }

    function get_acl_display_name_by_id(acl_id) {
        let acl = get_acl_by_id(acl_id)
        if (acl == null) {
            return "none"
        }
        return acl.display_name
    }
    
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

    async function on_change_acl_selected() {
    }
    
    async function update_all() {
	await update_acl_list();
	await update_patient_user_list();
    }
    
    async function update_acl_list() {
        acl_list = await bce_session.acls(true);
        if (acl_selected == "0" && acl_list.length > 0) {
            acl_selected = acl_list[0].acl_id;
        }
    }
    
    async function update_patient_user_list() {
        patient_user_list = await bce_session.chat_user_list();
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

    async function on_click_remove_prescription(rx_i) {
	if (editor !== null && expression !== null) {
	    editor.rxs.splice(rx_i, 1);
	    await changed_rx_editor_state();
	}
    }

    async function save_prescription(asset_name, rx) {
	const file_name = "assets/rx.json";
	const blob      = new Blob([JSON.stringify(rx)], {type: "application/json"});
        $alert = bce_lang($user_language, "component_stimrx_expression_editor_alert_upload_asset_in_progress");
        bce_session.asset_upload(acl_selected, asset_name, blob, file_name)
            .then(async function (result) {
                if (!result) {
                    $alert = bce_lang($user_language, "component_stimrx_expression_editor_alert_upload_asset_failure");
                    return;
                }
                $alert = bce_lang($user_language, "component_stimrx_expression_editor_alert_upload_asset_success") + " (" + file_name + ")";
		let saved_asset_name = result;
		if (asset_name === null) {
		    editor.rxs.push(saved_asset_name);
		}
		await changed_rx_editor_state();
            })
            .catch(e => {
                console.log(e);
            })
    }

    async function on_click_add_prescription() {
	if (editor !== null) {
	    if (patient_user_selected == null || patient_user_selected == "") {
                $alert = bce_lang($user_language, "component_stimrx_expression_editor_alert_select_patient");
		return;
	    }
	    const rx = stimrx_editor.new_default_stimrx_editor_prescription(patient_user_selected);
	    await save_prescription(null, rx);
	}
    }

    async function save_prescription_callback(asset_name, rx) {
        console.log("save_prescription_callback: asset_name = \"" + asset_name + "\"");
	await save_prescription(asset_name, rx);
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

    async function on_prescription_asset_select(asset) {
        console.log("Prescription asset selected: " + asset.name + " (" + asset.file_name + ")");
	minimize_prescription_asset_selector = true;
	if (editor !== null && expression !== null) {
	    editor.rxs.push(asset.name);
            await changed_rx_editor_state();
	} else {
	    console.log("Could not find editor to add prescription.");
	}
    }

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
    <AssetSelector bind:minimize={minimize_prescription_asset_selector} popup_only={true} bind:selected_asset={selected_prescription} on_asset_select={on_prescription_asset_select} />
    {#if stimrx_editor.stimrx_editor__is_type(expression)}
        <table>
	    <tr>
	        <td>
                    <i>Prescription Editor</i>
	            <label>
                        {bce_lang($user_language, "component_stimrx_expression_editor_label_acl")}: 
                        <select bind:value={acl_selected} on:change={on_change_acl_selected}>
                            {#each acl_list as acl}
	                        <option value={acl.acl_id}>
	                            {acl.display_name}
	                        </option>
                            {/each}
                        </select>
                    </label>
	            <label>
                        {bce_lang($user_language, "component_stimrx_expression_editor_label_patient_user")}: 
                        <select bind:value={patient_user_selected} on:change={update_patient_user_list}>
                            {#each patient_user_list as patient_user}
	                        <option value={patient_user.email}>
	                            {patient_user.email}
	                        </option>
                            {/each}
                        </select>
                    </label>
	            <a href="#" on:click|preventDefault={on_click_add_prescription}>
	                {bce_lang($user_language, "component_stimrx_expression_editor_label_add_prescription")}
		    </a>
	            <a href="#" on:click|preventDefault={on_click_open_prescription}>
         	        {bce_lang($user_language, "component_stimrx_expression_editor_label_open_prescription")}
	            </a>
                </td>
            </tr>
	    {#each editor.rxs as rx_asset_name, rx_i}
                <tr>
		    <td>
		        <a href="#" on:click|preventDefault={async function (e) {await on_click_remove_prescription(rx_i);}}>
         	            {bce_lang($user_language, "component_stimrx_expression_editor_label_remove_prescription")}
	                </a>
                    </td>
		</tr>
		<tr>
                    <td>
	                {#await get_json_asset(rx_asset_name)}
	                    ...waiting
	                {:then rx}
                            <StimrxExpressionEditor expression={rx}
						    editor={editor}
						    path={[...path, "rxs", rx_i, "expression"]}
						    asset_cache={asset_cache}
						    editor_prescription={rx}
						    save_prescription_callback={async function () {
						        await save_prescription_callback(rx_asset_name, rx);
						    }}/>
 	                {:catch error}
	                    {error.message}
	                {/await}
                    </td>
                </tr>
            {/each}
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
