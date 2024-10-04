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
    import AssetSelector from '$lib/AssetSelector.svelte'
    
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
    
    function download_url(url, file_name){
        var link = document.createElement('a');
        link.href = url;
        link.download = file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    //<a href="https://bce.center:8000/asset/download?session_token={$user_session_token}&name={asset.name}&q={Math.round(1000000000* Math.random())}">
    //{asset.file_name}
    //</a>
    async function on_asset_select(asset) {
        console.log("Asset selected: " + asset.name + " (" + asset.file_name + ")");
        var file_name = asset.file_name.substr(asset.file_name.lastIndexOf('/') + 1);
        var url = "https://bce.center:8000/asset/download?session_token=" + $user_session_token + "&name=" + asset.name + "&file_name=" + file_name;
        console.log("Downloading asset at: " + url);
        console.log("file_name = " + file_name);
        download_url(url, file_name);
    };
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_assets_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

    <h1>{bce_lang($user_language, "page_assets_title")}</h1>

    <AssetSelector on_asset_select={on_asset_select} />
  
{/if}


