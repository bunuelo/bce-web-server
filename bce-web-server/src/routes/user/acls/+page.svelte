<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let new_acl_display_name = "";
    
    let acls = null;
    
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
            $alert = "Failed to create ACL.";
        }
    }

    async function on_click_delete_acl(acl_id) {
        let success = await bce_session.delete_acl(acl_id);
        if (success) {
            $alert = "ACL deleted successfully!";
            await update_acl_list();
        } else {
            $alert = "Failed to delete ACL.";
        }
    }
    
    async function handle_click_public(event, acl_id) {
        console.log("handle_click_public: here.");
        console.log("handle_click_public: event.target.checked = " + event.target.checked);
        let new_public = (event.target.checked === true || event.target.checked === "true");
        let success = await bce_session.acl_update(acl_id, new_public, null);
        if (success) {
            $alert = "ACL updated successfully!";
            await update_acl_list();
        } else {
            $alert = "Failed to update ACL.";
        }
    }
    
    async function handle_click_active(event, acl_id) {
        console.log("handle_click_active: here.");
        console.log("handle_click_active: event.target.checked = " + event.target.checked);
        let new_active = (event.target.checked === true || event.target.checked === "true");
        let success = await bce_session.acl_update(acl_id, null, new_active);
        if (success) {
            $alert = "ACL updated successfully!";
            await update_acl_list();
        } else {
            $alert = "Failed to update ACL.";
        }
    }
    
</script>


<svelte:head>
    <title>User ACLs</title>
</svelte:head>

{#if acls}

  <h1>User ACLs</h1>
  
  <table>
      <tr>
          <td><i>Display Name</i></td>
          <td style="text-align:center;"><i>Owner</i></td>
          <td style="text-align:center;"><i>Read</i></td>
          <td style="text-align:center;"><i>Write</i></td>
          <td style="text-align:center;"><i>Public</i></td>
          <td style="text-align:center;"><i>Active</i></td>
          <td></td>
      </tr>
      {#key acls}
        {#each acls as acl}
          <tr>
              <td>
                  {acl.display_name}
              </td>
              <td style="text-align:center;">
                  <input type="checkbox" checked={acl.owner} disabled="disabled">
              </td>
              <td style="text-align:center;">
                  <input type="checkbox" checked={acl.read} disabled="disabled">
              </td>
              <td style="text-align:center;">
                  <input type="checkbox" checked={acl.write} disabled="disabled">
              </td>
              <td style="text-align:center;">
                  {#if acl.owner}
                    <input type="checkbox" checked={acl.public} on:click|preventDefault={async function (event) {await handle_click_public(event, acl.acl_id);}}>
                  {:else}
                    <input type="checkbox" checked={acl.public} disabled="disabled">
                  {/if}
                </td>
              <td style="text-align:center;">
                  {#if acl.owner}
                    <input type="checkbox" checked={acl.active} on:click|preventDefault={async function (event) {await handle_click_active(event, acl.acl_id);}}>
                  {:else}
                    <input type="checkbox" checked={acl.active} disabled="disabled">
                  {/if}
              </td>
              <td>
                  {#if acl.owner}
                    <a href="#" on:click={() => on_click_delete_acl(acl.acl_id)}>delete</a>
                  {/if}
              </td>
          </tr>
        {/each}
      {/key}
  </table>
  
  <p>
    <input type="text" bind:value="{new_acl_display_name}" style="width: 150px;" />
    <a href="#" on:click={on_click_create_acl}>create acl</a>
  </p>

{/if}


