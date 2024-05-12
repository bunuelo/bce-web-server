<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let acls = []
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        acls = await bce_session.acls()
    });
</script>

<svelte:head>
    <title>User Data</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>User Data</h1>
  
  <h2>Access Control Lists</h2>

  <p>{acls}</p>
  
  <h2>Assets</h2>
  
  
{/if}


