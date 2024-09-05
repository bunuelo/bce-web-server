<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let chats = [];
    let chats_count = 0;

    let chat_selected = "0";
    
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
        await update_chat_list();
    });

    async function update_chat_list() {
        chats = await bce_session.chats();
        chat_selected = "0";
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_chats_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>{bce_lang($user_language, "page_chats_title")}</h1>
  
  <p>{bce_lang($user_language, "page_chats_label_total_assets_count")}: {chats_count}</p>

  {#each chats as chat}
    {chat}
  {/each}
  
{/if}


