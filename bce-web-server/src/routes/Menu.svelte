<script lang="ts">
    import { onMount } from 'svelte';
    import Transition from 'svelte-transition'
    import { page } from '$app/stores';
    import Logo from './Logo.svelte'
    import Edit from './Edit.svelte'
    import { user_session_is_valid, user_security_level, user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    
    let bce_session = new BceSession();

    let minimize      = true;
    let user_tab_open = false;

    let done_loading = false;
    
    onMount(async () => {
        $user_session_is_valid = await bce_session.session_is_valid();
        $user_security_level = await bce_session.security_level();
        done_loading = true;
    });

    $: (function () {
        user_tab_open = ($page.url.pathname).includes("/user");
    })();

    function on_click_menu_icon() {
	minimize = !minimize;
    }
    
</script>

<style>
    div.menu_icon {
        float: right;
        width: 50px;
        height: 50px;
        font-size: 46px;
    }
    a {
        text-decoration: none;
    }
</style>


{#if done_loading}
<nav aria-labelledby="mainmenulabel">
    <div id="mainmenulabel" hidden>Main Menu</div>
    <div class="menu_container">
        <div class="menu_icon">
            <a href="#" on:click|preventDefault={on_click_menu_icon}>☰</a>
	</div>
        {#if !minimize}
        <ul class="menu">
            <li class="menu">
	        <a href="/" aria-current={$page.url.pathname === "/"}>{bce_lang($user_language, "menu_home")}</a>
            </li>
            {#if $user_session_is_valid}
              <li class="menu">
	          <a href="/user/logout" aria-current={$page.url.pathname === "/user/logout"}>{bce_lang($user_language, "menu_logout")}</a>
              </li>
            <li class="menu">
	        <a href="/user/dashboard" aria-current={$page.url.pathname === "/user/dashboard"}>{bce_lang($user_language, "menu_dashboard")}</a>
                <ul class="menu">
                    {#if user_tab_open}
                      <li class="menu">
	                  <a href="/user/settings" aria-current={$page.url.pathname === "/user/settings"}>{bce_lang($user_language, "menu_settings")}</a>
                      </li>
                      {#if $user_security_level >= 25}
                        <li class="menu">
	                    <a href="/user/acls" aria-current={$page.url.pathname === "/user/acls"}>{bce_lang($user_language, "menu_acls")}</a>
                        </li>
                        <li class="menu">
                            <a href="/user/assets" aria-current={$page.url.pathname === "/user/assets"}>{bce_lang($user_language, "menu_assets")}</a>
                        </li>
                        <li class="menu">
                            <a href="/user/chats" aria-current={$page.url.pathname === "/user/chats"}>{bce_lang($user_language, "menu_chats")}</a>
                        </li>
                        <li class="menu">
                            <a href="/user/devices" aria-current={$page.url.pathname === "/user/devices"}>{bce_lang($user_language, "menu_devices")}</a>
                        </li>
                        <li class="menu">
                            <a href="/user/evaluations" aria-current={$page.url.pathname === "/user/evaluations"}>{bce_lang($user_language, "menu_evaluations")}</a>
                        </li>
                        <li class="menu">
                            <a href="/user/rxs" aria-current={$page.url.pathname === "/user/rxs"}>{bce_lang($user_language, "menu_rxs")}</a>
                        </li>
                      {/if}
                    {/if}
                </ul>
            </li>
          {:else}
            <li class="menu">
	        <a href="/user/login" aria-current={$page.url.pathname === "/user/login"}>{bce_lang($user_language, "menu_login")}</a>
            </li>
            <li class="menu">
	        <a href="/user/create-account" aria-current={$page.url.pathname === "/user/create-account"}>{bce_lang($user_language, "menu_create_account")}</a>
            </li>
          {/if}
          {#if $user_security_level >= 25}
            <li class="menu">
	        <a href="/design" aria-current={$page.url.pathname === "/design"}>{bce_lang($user_language, "menu_design")}</a>
            </li>
          {/if}
          {#if $user_security_level >= 100}
            <li class="menu">
	        <a href="/inventory" aria-current={$page.url.pathname === "/inventory"}>{bce_lang($user_language, "menu_inventory")}</a>
            </li>
          {/if}
          <li class="menu">
              <a href="/docs" aria-current={$page.url.pathname === "/docs"}>{bce_lang($user_language, "menu_docs")}</a>
          </li>
            <li class="menu">
	        <a href="/terms" aria-current={$page.url.pathname === "/terms"}>{bce_lang($user_language, "menu_terms")}</a>
            </li>
            <li class="menu">
	        <a href="/contact" aria-current={$page.url.pathname === "/contact"}>{bce_lang($user_language, "menu_contact")}</a>
            </li>
        </ul>
        {/if}
    </div>
</nav>
{/if}
    
