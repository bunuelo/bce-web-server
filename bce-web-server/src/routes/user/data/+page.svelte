<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let new_acl_display_name = "";
    
    let acls = [];
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        await update_acl_list();
    });

    async function update_acl_list() {
        acls = await bce_session.acls()
    }
    
    function reset_new_acl() {
        new_acl_display_name = "";
    }
    
    async function on_click_create_acl() {
        let success = await bce_session.create_acl(new_acl_display_name);
        if (success) {
            $alert = "ACL created successfully!";
            reset_new_acl();
            await update_acl_list();
        } else {
            $alert = "Failed to create product.";
        }
    }

</script>

<svelte:head>
    <title>User Data</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>User Data</h1>
  
  <h2>Access Control Lists</h2>

  <table>
      <tr>
          <td><i>Display Name</i></td>
      </tr>
      {#key acls}
        {#each acls as acl}
          <tr>
              <td>
              {acl.display_name}
              </td>
          </tr>
        {/each}
      {/key}
  </table>
  
  <a href="#" on:click={on_click_create_acl}>create acl</a>

  <h2>Assets</h2>
  
  
{/if}


