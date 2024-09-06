<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    
    let chat_request_list = [];
    
    let chats = [];
    let chats_count = 0;

    let chat_selected = "0";
    
    let new_request_chat_user_email = "";
    
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
        await update_chat_request_list();
        await update_chat_list();
    });

    async function update_chat_list() {
        chats = await bce_session.chats();
        chat_selected = "0";
    }
    
    async function update_chat_request_list() {
        chat_request_list = await bce_session.chat_request_list();
    }
    
    async function on_click_request_chat_user() {
        let success = await bce_session.request_chat(new_request_chat_user_email);
        if (success) {
            $alert = bce_lang($user_language, "page_chats_alert_create_chat_request_success");
        } else {
            $alert = bce_lang($user_language, "page_chats_alert_create_chat_request_failure");
        }
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_chats_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>{bce_lang($user_language, "page_chats_title")}</h1>
    
  <div>
      {#if chat_request_list}
          The following users have requested to chat with you:
      {/if}
  <table>
      {#each chat_request_list as chat_request_user}
          <tr>
              <td>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </td>
              <td>
                  <i>{chat_request_user.email}</i>: 
              </td>
              <td>
                  <a href="#">Accept</a>
              </td>
              <td>
                  <a href="#">Reject</a>
              </td>
          </tr>
      {/each}
  </table>
  </div>
  
  <p>{bce_lang($user_language, "page_chats_label_total_assets_count")}: {chats_count}</p>
  
      {#key acls}
        {#each acls as acl}
        {/each}
      {/key}
  <p>
    <input type="text" bind:value="{new_request_chat_user_email}" style="width: 150px;" />
    <a href="#" on:click={on_click_request_chat_user}>{bce_lang($user_language, "page_chats_label_request_chat")}</a>
  </p>
  
{/if}


