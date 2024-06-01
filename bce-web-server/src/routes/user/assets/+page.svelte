<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let acls = [];
    let assets_count = 0;
    let assets = [];

    let acl_selected = "0";
    
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
        assets = await bce_session.assets(acl_id);
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_assets_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>{bce_lang($user_language, "page_assets_title")}</h1>
  
  <label>
      {bce_lang($user_language, "page_assets_label_acl")}: 
      <select bind:value={acl_selected} on:change={update_asset_list}>
	  <option value="0">
	      {bce_lang($user_language, "page_assets_label_all")}
	  </option>
          {#each acls as acl}
	    <option value={acl.acl_id}>
	        {acl.display_name}
	    </option>
          {/each}
      </select>
  </label>
  
  <p>{bce_lang($user_language, "page_assets_label_total_assets_count")}: {assets_count}</p>

  <ul>
      {#each assets as asset}
        <img src="https://bce.center:8000/asset/download?name={asset.name}" alt="{asset.display_name}">
      {/each}
    </ul>
  
{/if}


