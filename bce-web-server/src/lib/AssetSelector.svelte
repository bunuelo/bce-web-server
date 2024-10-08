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

    export let minimize = false;
    
    export let selected_asset;
    
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
    
    async function on_click_select_evaluation() {
        minimize = false;
    }

    export let on_asset_select = async function (asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
    };
    
    async function on_click_cancel() {
        minimize = true;
    }

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
        border: 2px solid var(--element2);
    }

    div.cancelButton {
        text-align: center;
        border: 2px solid var(--element2);
    }
</style>

{#if $user_session_is_valid && $user_security_level >= 25}

    <div>
        <table>
            <tr>
                <td>
                    {#if selected_asset == null}
                        <i>none</i>
                    {:else}
                        <table>
                            <tr>
                                <td>
                                    {selected_asset.file_name}
                                </td>
                                <td>
                                    {format_json_datetime(selected_asset.creation_time)}
                                </td>
                            </tr>
                        </table>
                    {/if}
                </td>
                <td>
                    <a href="#" on:click|preventDefault={on_click_select_evaluation}>
                        {bce_lang($user_language, "component_asset_selector_label_select_evaluation")}
                    </a>
                </td>
            </tr>
        </table>
    </div>

    {#if !minimize}
        <div class="overlayDiv">
            <div class="popupDiv">
                <table>
		    <tr>
		        <td style="width:99%">
			    <i>{bce_lang($user_language, "component_asset_selector_label_select_an_asset")}</i>
		        </td>
		        <td style="width:1%">
		            <div class="cancelButton">
		        </td>
		    </tr>
		</table>
                    <a href="#" on:click|preventDefault={on_click_cancel}>
                        {bce_lang($user_language, "component_asset_selector_label_cancel")}
                    </a>
                </div>
                <AssetList on_asset_select={on_asset_select} bind:selected_asset={selected_asset}/>
            </div>
        </div>
    {/if}
{/if}
