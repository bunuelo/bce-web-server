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

    export let minimize = false;

    export let on_asset_select = async function (asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
    };
    
    export let selected_asset = null;
    
    //<a href="https://bce.center:8000/asset/download?session_token={$user_session_token}&name={asset.name}&q={Math.round(1000000000* Math.random())}">
    //{asset.file_name}
    //</a>
    
    let acls = [];
    let assets_count = 0;
    let assets_loaded_count = 0;
    let assets = [];
    const assets_page_size = 10;
    
    let acl_selected = "0";
    
    let view_mode = "LIST";
    
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
        await update_acl_list();
        await update_asset_list();
    });
    
    async function update_acl_list() {
        acls = await bce_session.acls();
        acl_selected = "0";
    }
    
    async function update_asset_list() {
        var acl_id = acl_selected;
        if (acl_id == "0") {
            acl_id = null;
        }
        assets_count = await bce_session.assets_count(acl_id);
        assets = await bce_session.assets(1, assets_page_size, acl_id);
        assets_loaded_count = assets_page_size;
    }
    
    async function on_click_select_evaluation() {
        minimize = false;
    }

    async function fetch_more_assets() {
        if (assets_loaded_count < assets_count) {
            const next_page = Math.round(assets_loaded_count / assets_page_size) + 1;
            console.log("fetching page " + next_page + " of assets!");
            var acl_id = acl_selected;
            if (acl_id == "0") {
                acl_id = null;
            }
            var temp_assets = assets;
            assets = null;
            let more_assets = await bce_session.assets(next_page, assets_page_size, acl_id);
            for (var i = 0; i < more_assets.length; i ++) {
                console.log("adding another asset!");
                temp_assets.push(more_assets[i]);
            }
            assets = temp_assets;
            assets_loaded_count += assets_page_size;
        }
    }
    
    let scrolling_div;
    async function on_scroll_scrolling_div() {
        console.log("scrolling_div.scrollHeight = " + scrolling_div.scrollHeight + ", scrolling_div.scrollTop = " + scrolling_div.scrollTop);
        if (Math.abs(scrolling_div.scrollHeight - scrolling_div.clientHeight - scrolling_div.scrollTop) <= 1) {
            console.log("totally scrolled.");
            await fetch_more_assets();
        }
    }
    
</script>

<style>
    div.scrollingDiv {
        overflow:scroll;
        max-height: 200px;
    }
</style>

{#if $user_session_is_valid && $user_security_level >= 25}

  {#if minimize}
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
  {:else}
  <div>
    <label>
        {bce_lang($user_language, "component_asset_selector_label_acl")}: 
        <select bind:value={acl_selected} on:change={update_asset_list}>
	    <option value="0">
	        {bce_lang($user_language, "component_asset_selector_label_all")}
	    </option>
            {#each acls as acl}
	        <option value={acl.acl_id}>
	            {acl.display_name} 
	        </option>
            {/each}
        </select>
    </label>
    
    <p>{bce_lang($user_language, "component_asset_selector_label_total_assets_count")}: {assets_count}</p>
    
    <div bind:this={scrolling_div} class="scrollingDiv" on:scroll={on_scroll_scrolling_div}>
    {#if view_mode == "LIST"}
        <table>
            <tr>
                <td>
                    <i>{bce_lang($user_language, "component_asset_selector_label_file_name")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "component_asset_selector_label_asset_type")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "component_asset_selector_label_creation_time")}</i>
                </td>
            </tr>
            {#each assets as asset}
                <tr>
                    <td>
                        <a href="#" on:click|preventDefault={async function () {return await on_asset_select(asset);}}>
                            {asset.file_name}
                        </a>
                    </td>
                    <td>
                        {asset.asset_type}
                    </td>
                    <td>
                        {format_json_datetime(asset.creation_time)}
                    </td>
                </tr>
            {/each}
        </table>  
    {:else}
        {#each assets as asset}
            <div class="asset_preview">
                <img class="asset_preview" src="https://bce.center:8000/asset/download?session_token={$user_session_token}&name={asset.name}&q={Math.random()}" alt="{asset.file_name}">
            </div>
        {/each}
    {/if}
    </div>
    
    </div>
  {/if}
{/if}
