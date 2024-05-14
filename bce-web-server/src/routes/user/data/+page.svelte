<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let acls = [];

    let acl_selected = null;
    
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
        await update_acl_list();
    });

    async function update_acl_list() {
        acls = await bce_session.acls()
    }
    
</script>


<svelte:head>
    <title>User Data</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>User Data</h1>
  
<p>
    ACL: 
    <select bind:value={acl_selected}>
        {#each acls as acl}
	  <option value={acl.acl_id}>
	      {acl.display_name}
	  </option>
        {/each}
      </select>
</p>

{/if}


