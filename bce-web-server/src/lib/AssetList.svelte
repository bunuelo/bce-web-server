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

    export let selected_asset = null;

    export let height = window.clientHeight;
    
    let acls = [];
    let assets_count = 0;
    let assets_loaded_count = 0;
    let assets = [];
    const assets_page_size = 50;
    
    let acl_selected = "0";
    
    let scrolling_div = null;

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

    export let on_asset_select = async function (asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        selected_asset = asset;
        minimize = true;
    };
    
    async function fetch_more_assets() {
        if (assets_loaded_count < assets_count) {
            const next_page = Math.round(assets_loaded_count / assets_page_size) + 1;
            var acl_id = acl_selected;
            if (acl_id == "0") {
                acl_id = null;
            }
            let more_assets = await bce_session.assets(next_page, assets_page_size, acl_id);
            var temp_assets = assets;
            assets = [];
            for (var i = 0; i < more_assets.length; i ++) {
                temp_assets.push(more_assets[i]);
            }
            assets = temp_assets;
            assets_loaded_count += assets_page_size;
        }
    }
    
    async function on_scroll_scrolling_div() {
        if (Math.abs(scrolling_div.scrollHeight - scrolling_div.clientHeight - scrolling_div.scrollTop) <= 1) {
            await fetch_more_assets();
        }
    }

    $: (function () {
	if (scrolling_div !== null) {
	    scrolling_div.style["max-height"] = "" + (height - 50) + "px";
	}
    })()

</script>

<style>
    div.scrollingDiv {
        overflow:scroll;
        max-height: 50vh;
	white-space: nowrap;
        background: var(--surface2);
        text-color: var(--element2);
    }

    th {
        position: sticky;
        top: 0px;
        background: var(--surface1);
	white-space: nowrap;
    }
</style>

{#if $user_session_is_valid && $user_security_level >= 25}

    <div>
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
        {bce_lang($user_language, "component_asset_selector_label_total_assets_count")}: {assets_count}
    </div>
    
    <div bind:this={scrolling_div} class="scrollingDiv" on:scroll={on_scroll_scrolling_div}>
        <table>
            <tr>
                <th>
                    <i>{bce_lang($user_language, "component_asset_selector_label_file_name")}</i>
                </th>
                <th>
                    <i>{bce_lang($user_language, "component_asset_selector_label_asset_type")}</i>
                </th>
                <th>
                    <i>{bce_lang($user_language, "component_asset_selector_label_creation_time")}</i>
                </th>
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
    </div>
    
{/if}
