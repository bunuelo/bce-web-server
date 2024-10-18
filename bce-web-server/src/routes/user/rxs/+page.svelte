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
    import { stimrx } from '$lib/stimrx/stimrx.js';
    import { stimrx_editor } from '$lib/stimrx/stimrx_editor.js';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    import StimrxExpressionEditor from '$lib/stimrx/StimrxExpressionEditor.svelte'
    
    let selected_asset = null;
    let minimize = true;
    let rx_editor_state = stimrx_editor.new_stimrx_editor();
    let asset_cache = {};

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
	await update_rx_editor_state();
    }

    async function update_rx_editor_state() {
	var stored_rx_editor_state = await bce_session.rx_editor_state();
	if (stored_rx_editor_state !== null && stored_rx_editor_state !== "") {
	    rx_editor_state = JSON.parse(stored_rx_editor_state);
	}
    }

</script>

<style>
</style>

<svelte:head>
    <title>{bce_lang($user_language, "page_rxs_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_rxs_title")}</h1>
    
    <StimrxExpressionEditor bind:expression={rx_editor_state} editor={rx_editor_state} bind:asset_cache={asset_cache}  editor_prescription={null}/>
    
<!--
a comment
/!-->

{/if}


