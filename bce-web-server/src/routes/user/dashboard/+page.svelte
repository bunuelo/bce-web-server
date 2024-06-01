<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let done_loading = false;
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        $user_security_level = await bce_session.security_level();
        done_loading = true;
    });

</script>

<svelte:head>
    <title>{bce_lang($user_language, "page_dashboard_title")}</title>
</svelte:head>

{#if done_loading}

  <h1>{bce_lang($user_language, "page_dashboard_title")}</h1>
  
  <ul>
      <li>
	  <a href="/user/settings">{bce_lang($user_language, "page_dashboard_label_settings")}</a>: {bce_lang($user_language, "page_dashboard_description_settings")}
      </li>
      {#if $user_security_level >= 25}
        <li>
	    <a href="/user/acls">{bce_lang($user_language, "page_dashboard_label_acls")}</a>: {bce_lang($user_language, "page_dashboard_description_acls")}
        </li>
        <li>
            <a href="/user/assets">{bce_lang($user_language, "page_dashboard_label_assets")}</a>: {bce_lang($user_language, "page_dashboard_description_assets")}
        </li>
      {/if}
  </ul>
  
{/if}


