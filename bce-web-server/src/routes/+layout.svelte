<script lang="ts">
    import { onMount } from 'svelte';
    import { getStores, navigating, page, updated } from '$app/stores';
    import Logo from './Logo.svelte'
    import Menu from './Menu.svelte'
    import { alert } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let done_loading = false;
    
    onMount(async () => {
        bce_session.update_session_from_cookie();
        if ($user_color_theme == "light" || $user_color_theme == "dark") {
             document.documentElement.setAttribute("color-mode", $user_color_theme);
        }
        $user_color_theme = await bce_session.color_theme()
        if ($user_color_theme == "light" || $user_color_theme == "dark") {
             document.documentElement.setAttribute("color-mode", $user_color_theme);
        }
        done_loading = true;
    });

</script>

<link rel="icon" href="/favicon.png" />

<style>
    div.menuDiv {
	float: right
    }
</style>

{#if done_loading}
    <header>
        <a href="#content" class="skip-link">Skip to main content</a>
        {#if $alert}
            <div on:click={() => $alert = ''} class="alert">
                {$alert}
            </div>
        {/if}
        <Logo />
        <div class="menuDiv">
            <Menu />
        </div>
    </header>
    <div class="main_content">
        <main id="content">
            <slot />
        </main>
    </div>
    <div>
        &nbsp; <!-- space for alert !-->
    </div>
{/if}
