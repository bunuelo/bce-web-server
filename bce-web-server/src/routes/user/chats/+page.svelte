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
    
    let chat_user_list = [];
    
    let chat_list = [];
    let chats_count = 0;

    let chat_selected = "0";
    
    let new_request_chat_user_email = "";

    let chat_user_selected = ""

    let new_chat_text = ""
    
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
        await update_all();
    });

    async function update_chat_request_list() {
        chat_request_list = await bce_session.chat_request_list();
        console.log("chat_request_list = " + chat_request_list)
    }
    
    async function update_chat_user_list() {
        chat_user_list = await bce_session.chat_user_list();
    }
    
    async function update_chat_list() {
        chat_list = await bce_session.chat_list();
        chat_selected = "0";
    }
    
    async function update_all() {
        await update_chat_request_list();
        await update_chat_user_list();
        await update_chat_list();
    }
    
    async function on_click_request_chat_user() {
        let request_chat_user_email = new_request_chat_user_email
        new_request_chat_user_email = ""
        let success = await bce_session.request_chat(request_chat_user_email);
        if (success) {
            $alert = bce_lang($user_language, "page_chats_alert_create_chat_request_success");
        } else {
            $alert = bce_lang($user_language, "page_chats_alert_create_chat_request_failure");
        }
        await update_all();
    }
    
    async function on_click_chat_request_response(email, accept) {
        let success = await bce_session.chat_request_response(email, accept);
        if (success) {
            $alert = bce_lang($user_language, "page_chats_alert_chat_request_response_success");
            await update_all();
        } else {
            $alert = bce_lang($user_language, "page_chats_alert_chat_request_response_failure");
        }
    }

    let chat_recipients = []
    
    async function on_click_add_recipient() {
        if (chat_user_selected && chat_user_selected != "") {
            var already_in_list = false
            for (var i = 0; i < chat_recipients.length; i ++) {
                var email = chat_recipients[i]
                if (email == chat_user_selected) {
                    already_in_list = true
                    break
                }
            }
            if (! already_in_list) {
                let new_chat_recipients = chat_recipients
                chat_recipients = null
                new_chat_recipients.push(chat_user_selected)
                $alert = bce_lang($user_language, "page_chats_alert_add_recipient_success");
                chat_recipients = new_chat_recipients
            } else {
                $alert = "";
            }
        }
    }
    
    async function on_click_create_chat() {
        console.log("chat_recipients = " + chat_recipients)
        console.log("new_chat_text = " + new_chat_text)
        if (chat_recipients.length > 0) {
            await bce_session.chat_create(chat_recipients, new_chat_text)
            $alert = bce_lang($user_language, "page_chats_alert_chat_create_success");
        } else {
            $alert = "";
        }
        await update_all();
    }

</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_chats_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>{bce_lang($user_language, "page_chats_title")}</h1>
    
  <div>
      {#if chat_request_list && chat_request_list.length > 0}
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
                  <a href="#" on:click={() => on_click_chat_request_response(chat_request_user.email, true)}>Accept</a>
              </td>
              <td>
                  <a href="#" on:click={() => on_click_chat_request_response(chat_request_user.email, false)}>Reject</a>
              </td>
          </tr>
      {/each}
  </table>
  </div>

  <table>
        <tr>
            <td>
                <i>{bce_lang($user_language, "page_chats_label_sender")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_chats_label_recipients")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_chats_label_text")}</i>
            </td>
        </tr>
      {#each chat_list as chat}
        <tr>
            <td>
                {chat.sender}
            </td>
            <td>
                {(function (recipients) {
                     var recipients_text = ""
                     for (var i = 0; i < recipients.length; i ++) {
                         if (i != 0) {
                             recipients_text += ", "
                         }
                         recipients_text += recipients[i]
                     }
                     return recipients_text
                  })(chat.recipients)}
            </td>
            <td>
                {chat.text}
            </td>
        </tr>
      {/each}
  </table>
  
  <h2>
      {bce_lang($user_language, "page_chats_title_create_chat")}
  </h2>
  
  <p>
  <label>
      {bce_lang($user_language, "page_chats_label_chat_request_email")}: 
      <input type="text" bind:value="{new_request_chat_user_email}" style="width: 150px;" />
      <a href="#" on:click={on_click_request_chat_user}>{bce_lang($user_language, "page_chats_label_request_chat")}</a>
  </label>
  </p>
  
  <p>
  <label>
      {bce_lang($user_language, "page_chats_label_chat_user")}: 
      <select bind:value={chat_user_selected} on:change={update_chat_user_list}>
          {#each chat_user_list as chat_user}
	    <option value={chat_user.email}>
	        {chat_user.email}
	    </option>
          {/each}
      </select>
  </label>
  <a href="#" on:click={on_click_add_recipient}>{bce_lang($user_language, "page_chats_label_add_recipient")}</a>
  </p>

  <table>
      <tr>
          <td>
              {bce_lang($user_language, "page_chats_label_recipients")}:
          </td>
          <td>
              {#each chat_recipients as chat_recipient}
                  {(chat_recipient != chat_recipients[0] ? ", " : "") + chat_recipient}
              {/each}
            </td>
      </tr>
  </table>
  
  <p>
  <textarea rows="4" cols="50" bind:value={new_chat_text}></textarea>
  </p>

  <p>
  <a href="#" on:click={on_click_create_chat}>{bce_lang($user_language, "page_chats_label_create_chat")}</a>
  </p>

{/if}


