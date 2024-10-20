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

    async function on_change_acl_selected() {
    }
    
    async function update_all() {
	await update_acl_list();
    }
    
    async function update_acl_list() {
        acl_list = await bce_session.acls(true);
        if (acl_selected == "0" && acl_list.length > 0) {
            acl_selected = acl_list[0].acl_id;
        }
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

    async function on_click_remove_prescription() {
	if (editor !== null && expression !== null && stimrx_editor.stimrx_editor_prescription__is_type(expression)) {
	    let rx = expression;
	    var i = 0;
	    while (i < editor.rxs.length && editor.rxs[i] !== rx) {
		i ++;
	    }
	    if (i < editor.rxs.length) {
		editor.rxs.splice(i, 1);
		await changed_rx_editor_state();
	    }
	}
    }

    async function on_click_add_prescription() {
	if (editor !== null) {
	    const rx   = stimrx_editor.new_default_stimrx_editor_prescription();
	    const blob = new Blob([JSON.stringify(rx)], {type: "application/json"});
	    let file_name = "assets/rx.json";
            bce_session.asset_upload(acl_selected, blob, file_name)
                .then(async function (result) {
                    if (!result) {
                        $alert = bce_lang($user_language, "component_stimrx_expression_editor_alert_upload_asset_failure");
                        return;
                    }
                    $alert = bce_lang($user_language, "component_stimrx_expression_editor_alert_upload_asset_success") + ": " + file_name;
		    let asset_name = result;
		    editor.rxs.push(asset_name);
		    await changed_rx_editor_state();
                })
                .catch(e => {
                    console.log(e);
                })
	}
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
	            <a href="#" on:click|preventDefault={on_click_add_prescription}>
	                {bce_lang($user_language, "component_stimrx_expression_editor_label_add_prescription")}
		    </a>
                </td>
            </tr>
	    {#each editor.rxs as rx_asset_name, rx_i}
                <tr>
                    <td>
	                {#await get_json_asset(rx_asset_name)}
	                    ...waiting
	                {:then rx}
                            <StimrxExpressionEditor expression={rx} bind:editor={editor} path={[...path, "rxs", rx_i, "expression"]} bind:asset_cache={asset_cache} editor_prescription={rx}/>
                            <!--<StimrxExpressionEditor expression={rx} bind:editor={expression} path={[...path, "rxs", rx_i, "expression"]} bind:asset_cache={asset_cache} bind:editor_prescription={editor_prescription}/>!-->
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
