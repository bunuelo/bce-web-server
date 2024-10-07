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
    import AssetList from '$lib/AssetList.svelte'
    
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
    
    function download_url(url){
        var link = document.createElement('a');
        link.href = url;
        link.click();
    }
    
    async function on_asset_select(asset) {
        console.log("Download asset: " + asset.name + " (" + asset.file_name + ")");
        var url = "https://bce.center:8000/asset/download?session_token=" + $user_session_token + "&name=" + asset.name;
        download_url(url);
    };
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_assets_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_assets_title")}</h1>

    <AssetList on_asset_select={on_asset_select} />
  
{/if}


