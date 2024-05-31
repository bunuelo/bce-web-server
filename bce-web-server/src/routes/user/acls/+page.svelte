<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let new_acl_display_name = "";
    let edit_display_name_acl_id = null;
    let edit_acl_display_name = null;
    
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
        acls = null;
        acls = await bce_session.acls();
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
    
    async function on_click_edit_acl_display_name(acl_id, display_name) {
        edit_display_name_acl_id = acl_id;
        edit_acl_display_name = display_name;
    }
    
    async function on_click_save_acl_display_name(acl_id) {
        let success = await bce_session.acl_update(acl_id, edit_acl_display_name, null, null);
        if (success) {
            $alert = bce_lang($user_language, "page_acls_alert_update_acl_success");
            await update_acl_list();
        } else {
            $alert = bce_lang($user_language, "page_acls_alert_update_acl_failure");
        }
        edit_display_name_acl_id = null;
    }

    async function on_click_upload_asset(acl_id) {
        var input = document.createElement('input');
        input.type = "file";
        input.multiple = true;
        input.onchange = function (event) { 
            var files = event.target.files;
            console.log(files);
            var i = 0;
            function upload_rest() {
                var file = files[i];
                bce_session.asset_upload(acl_id, file)
                    .then(result => {
                        $alert = "Successfully uploaded file (" + (i + 1) + "/" + (files.length) + ") " + file.name + "!";
                        if (!result) {
                            $alert = "Some files (" + (files.length - (i + 1)) + "/" + (files.length) + ") failed to upload.";
                            return;
                        }
                        i ++;
                        if (i < files.length) {
                            upload_rest();
                        } else {
                            $alert = "All (" + (files.length) + ") files uploaded successfully!";
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }
            upload_rest();
        }
        input.click();
    }
    
    async function handle_click_public(event, acl_id) {
        console.log("handle_click_public: here.");
        console.log("handle_click_public: event.target.checked = " + event.target.checked);
        let new_public = (event.target.checked === true || event.target.checked === "true");
        let success = await bce_session.acl_update(acl_id, null, new_public, null);
        if (success) {
            $alert = bce_lang($user_language, "page_acls_alert_update_acl_success");
            await update_acl_list();
        } else {
            $alert = bce_lang($user_language, "page_acls_alert_update_acl_failure");
        }
    }
    
    async function handle_click_active(event, acl_id) {
        console.log("handle_click_active: here.");
        console.log("handle_click_active: event.target.checked = " + event.target.checked);
        let new_active = (event.target.checked === true || event.target.checked === "true");
        let success = await bce_session.acl_update(acl_id, null, null, new_active);
        if (success) {
            $alert = bce_lang($user_language, "page_acls_alert_update_acl_success");
            await update_acl_list();
        } else {
            $alert = bce_lang($user_language, "page_acls_alert_update_acl_failure");
        }
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_acls_title")}</title>
</svelte:head>

{#if acls}

  <h1>{bce_lang($user_language, "page_acls_title")}</h1>
  
  <table>
      <tr>
          <td><i>{bce_lang($user_language, "page_acls_label_display_name")}</i></td>
          <td style="text-align:center;"><i>{bce_lang($user_language, "page_acls_label_owner")}</i></td>
          <td style="text-align:center;"><i>{bce_lang($user_language, "page_acls_label_read")}</i></td>
          <td style="text-align:center;"><i>{bce_lang($user_language, "page_acls_label_write")}</i></td>
          <td style="text-align:center;"><i>{bce_lang($user_language, "page_acls_label_public")}</i></td>
          <td style="text-align:center;"><i>{bce_lang($user_language, "page_acls_label_active")}</i></td>
          <td style="text-align:center;"></td>
          <td></td>
      </tr>
      {#key acls}
        {#each acls as acl}
          <tr>
              <td>
                  {#if acl.owner}
                    {#if edit_display_name_acl_id == acl.acl_id}
                      <input type="text" bind:value="{edit_acl_display_name}">
                      <a href="#" on:click={() => on_click_save_acl_display_name(acl.acl_id)}
                          aria-label="{bce_lang($user_language, "page_acls_aria_label_save")}">{bce_lang($user_language, "page_acls_label_save")}</a>
                    {:else}
                      {acl.display_name}
                      <a href="#" on:click={() => on_click_edit_acl_display_name(acl.acl_id, acl.display_name)}
                          aria-label="{bce_lang($user_language, "page_acls_aria_label_edit")}">{bce_lang($user_language, "page_acls_label_edit")}</a>
                    {/if}
                  {:else}
                    {acl.display_name}
                  {/if}
              </td>
              <td style="text-align:center;">
                  <input type="checkbox" checked={acl.owner} disabled="disabled"
                         aria-label="{bce_lang($user_language, "page_acls_label_owner")}">
              </td>
              <td style="text-align:center;">
                  <input type="checkbox" checked={acl.read} disabled="disabled"
                         aria-label="{bce_lang($user_language, "page_acls_label_read")}">
              </td>
              <td style="text-align:center;">
                  <input type="checkbox" checked={acl.write} disabled="disabled"
                         aria-label="{bce_lang($user_language, "page_acls_label_write")}">
              </td>
              <td style="text-align:center;">
                  {#if acl.owner}
                    <input type="checkbox" checked={acl.public} on:click|preventDefault={async function (event) {await handle_click_public(event, acl.acl_id);}}
                           aria-label="{bce_lang($user_language, "page_acls_label_public")}">
                  {:else}
                    <input type="checkbox" checked={acl.public} disabled="disabled"
                           aria-label="{bce_lang($user_language, "page_acls_label_public")}">
                  {/if}
                </td>
              <td style="text-align:center;">
                  {#if acl.owner}
                    <input type="checkbox" checked={acl.active} on:click|preventDefault={async function (event) {await handle_click_active(event, acl.acl_id);}}
                           aria-label="{bce_lang($user_language, "page_acls_label_active")}">
                  {:else}
                    <input type="checkbox" checked={acl.active} disabled="disabled"
                           aria-label="{bce_lang($user_language, "page_acls_label_active")}">
                  {/if}
              </td>
              <td>
                  {#if acl.owner}
                    <a href="#" on:click={() => on_click_delete_acl(acl.acl_id)}
                        aria-label="Delete {acl.display_name}">delete</a>
                  {/if}
                  {#if acl.owner}
                    <a href="#" on:click={() => on_click_upload_asset(acl.acl_id)}
                        aria-label="Upload assets to {acl.display_name}">upload assets</a>
                  {/if}
              </td>
          </tr>
        {/each}
      {/key}
  </table>
  
  <p>
    <input type="text" bind:value="{new_acl_display_name}" style="width: 150px;" />
    <a href="#" on:click={on_click_create_acl}
       aria-label="Create ACL">create ACL</a>
  </p>

{/if}


