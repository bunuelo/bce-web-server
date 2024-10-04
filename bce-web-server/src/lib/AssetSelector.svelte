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
    
    let acls = [];
    let assets_count = 0;
    let assets = [];
    
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
        assets = await bce_session.assets(1, 50, acl_id);
    }
    
    async function on_click_select_evaluation() {
        minimize = false;
    }

</script>


{#if $user_session_is_valid && $user_security_level >= 25}

  {#if minimize}
    <div>
        <a href="#" on:click={on_click_select_evaluation}>{bce_lang($user_language, "component_asset_selector_label_select_evaluation")}</a>
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
                        <a href="https://bce.center:8000/asset/download?session_token={$user_session_token}&name={asset.name}&q={Math.round(1000000000* Math.random())}">
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
  {/if}
{/if}
