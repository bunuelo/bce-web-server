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

</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>Dashboard</h1>
  
  <ul>
      {#if $user_security_level >= 25}
        <li>
	    <a href="/user/settings">settings</a>: User display and other settings can be configured.
        </li>
        <li>
	    <a href="/user/acls">ACLs</a>: Access Control Lists (ACLs) can be created and managed by users to securely upload and optionally share data assets with other users.
        </li>
        <li>
            <a href="/user/assets">assets</a>: User assets can be securely searched, viewed, and downloaded.
        </li>
      {/if}
  </ul>
  
{/if}


