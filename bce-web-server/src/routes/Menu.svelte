<script lang="ts">
    import { onMount } from 'svelte';
    import Transition from 'svelte-transition'
    import { page } from '$app/stores';
    import Logo from './Logo.svelte'
    import Edit from './Edit.svelte'
    import { user_session_is_valid, user_security_level } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    
    let bce_session = new BceSession();

    let user_tab_open = false;
    
    onMount(async () => {
        $user_session_is_valid = await bce_session.session_is_valid();
        $user_security_level = await bce_session.security_level();
    });

    $: (function () {
        user_tab_open = ($page.url.pathname).includes("/user");
    })();
    
</script>

<nav aria-labelledby="mainmenulabel">
    <div id="mainmenulabel" hidden>Main Menu</div>
    <ul>
        <li>
	    <a href="/" aria-current={$page.url.pathname === "/"}>{bce_lang($user_language, "menu_home")}</a>
        </li>
        {#if $user_session_is_valid}
          <li>
	      <a href="/user/logout" aria-current={$page.url.pathname === "/user/logout"}>logout</a>
          </li>
          <li>
	      <a href="/user/dashboard" aria-current={$page.url.pathname === "/user/dashboard"}>dashboard</a>
              <ul>
                  {#if $user_security_level >= 25 && user_tab_open}
                    <li>
	                <a href="/user/settings" aria-current={$page.url.pathname === "/user/settings"}>settings</a>
                    </li>
                    <li>
	                <a href="/user/acls" aria-current={$page.url.pathname === "/user/acls"}>ACLs</a>
                    </li>
                    <li>
                        <a href="/user/assets" aria-current={$page.url.pathname === "/user/assets"}>assets</a>
                    </li>
                  {/if}
              </ul>
          </li>
        {:else}
          <li>
	      <a href="/user/login" aria-current={$page.url.pathname === "/user/login"}>login</a>
          </li>
          <li>
	      <a href="/user/create-account" aria-current={$page.url.pathname === "/user/create-account"}>create account</a>
          </li>
        {/if}
        {#if $user_security_level >= 25}
          <li>
	      <a href="/design" aria-current={$page.url.pathname === "/design"}>design</a>
          </li>
        {/if}
        {#if $user_security_level >= 100}
          <li>
	      <a href="/inventory" aria-current={$page.url.pathname === "/inventory"}>inventory</a>
          </li>
        {/if}
        <li>
            <a href="/docs" aria-current={$page.url.pathname === "/docs"}>docs</a>
        </li>
        <li>
	    <a href="/terms" aria-current={$page.url.pathname === "/terms"}>terms</a>
        </li>
        <li>
	    <a href="/contact" aria-current={$page.url.pathname === "/contact"}>contact</a>
        </li>
    </ul>
</nav>

    
