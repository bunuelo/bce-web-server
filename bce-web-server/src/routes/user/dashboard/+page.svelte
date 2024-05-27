<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        $user_security_level = await bce_session.security_level();
    });

    async function on_click_toggle_dark_mode() {
        console.log("Toggle dark mode.");
    }
    </script>

<svelte:head>
    <title>User Dashboard</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>User Dashboard</h1>
  
  <label>Toggle Dark Mode: <input type="checkbox" on:click|preventDefault={on_click_toggle_dark_mode}></label>
  
  {#if $user_security_level >= 25}
    <li>
	<a href="/user/acls">user ACLs</a>
    </li>
    <li>
        <a href="/user/assets">user assets</a>
    </li>
  {/if}
  
{/if}


