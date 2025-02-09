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
    import AssetList from "$lib/AssetList.svelte";
    let bce_session = new BceSession();

    export let minimize   = false;
    export let popup_only = false;

    export let selected_asset;

    let popup_div;

    let asset_list_height = 200;

    const on_window_resize = async function() {
	// trigger reflective monitor for popup_div
	let temp = popup_div;
	popup_div = null;
	popup_div = temp;
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
    }
    
    async function on_click_select_asset() {
        minimize = false;
    }

    // Copy and override this function externally to add custom asset selection handlers.
    export let on_asset_select = async function (asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
    };
    
    async function on_click_cancel() {
        minimize = true;
    }

    async function on_key_down(event) {
	switch(event.keyCode) {
	case 27: // escape
            minimize = true;
	    break;
	case 38: // up
	    break;
	case 40: // down
	    break;
	case 37: // left
	    break;
	case 39: // right
	    break;
	}
    }

    $: (function () {
	if (popup_div != null) {
	    asset_list_height = popup_div.clientHeight - 35;
	}
    })()

</script>

<style>
    div.overlayDiv {
        position: fixed;
        display: block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 2;
        cursor: pointer;
        overflow-y: hidden;
        overflow-x: hidden;
    }
     
    div.popupDiv {
        position: fixed;
        width: 75%;
        height: 75%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--surface1);
        border: 2px solid var(--surface3);
    }

    div.headerDiv {
        display: block-inline;
        border: 4px solid var(--surface1);
    }

    div.cancelDiv {
        width: 100px;
        text-align: center;
        border: 2px solid var(--surface3);
        margin-left: auto; 
        margin-right: 0;
	display: block-inline;
    }

    td.nowrap {
	white-space: nowrap;
    }
</style>

<svelte:window on:keydown|preventDefault={on_key_down} />

{#if $user_session_is_valid && $user_security_level >= 25}

    {#if !popup_only}
        <div>
            <table>
                <tr>
                    <td>
                        {#if selected_asset == null}
                            <i>none</i>
                        {:else}
                            <table>
                                <tr>
                                    <td class="nowrap">
                                        {selected_asset.file_name}
                                    </td>
                                    <td class="nowrap">
                                        {format_json_datetime(selected_asset.creation_time)}
                                    </td>
                                </tr>
                            </table>
                        {/if}
                    </td>
                    <td>
                    </td>
                </tr>
            </table>
        </div>
        <a href="#" on:click|preventDefault={on_click_select_asset}>
            {bce_lang($user_language, "component_asset_selector_label_select_asset")}
        </a>
    {/if}
		      
    {#if !minimize}
        <div class="overlayDiv">
            <div bind:this={popup_div} class="popupDiv">
	        <div class="headerDiv">
		     <i>{bce_lang($user_language, "component_asset_selector_label_select_an_asset")}</i>
		</div>
                <AssetList on_asset_select={on_asset_select} bind:selected_asset={selected_asset} bind:height={asset_list_height}/>
                <div class="cancelDiv">
                    <a href="#" on:click|preventDefault={on_click_cancel}>
                        {bce_lang($user_language, "component_asset_selector_label_cancel")}
                    </a>
                </div>
            </div>
        </div>
    {/if}
{/if}
