<script>
    import { onMount } from 'svelte';
    import { onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import { zero_pad, format_date, format_time_since_date, format_json_datetime, format_time_since_json_datetime } from '$lib/bce_time.js'
    
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let acl_list = [];
    let acl_selected = "0";

    function get_acl_by_id(acl_id) {
        for (var i = 0; i < acl_list.length; i ++) {
            let acl = acl_list[i]
            if (acl.acl_id == acl_id) {
                return acl
            }
        }
        return null
    }

    function get_acl_display_name_by_id(acl_id) {
        let acl = get_acl_by_id(acl_id)
        if (acl == null) {
            return "none"
        }
        return acl.display_name
    }
    
    let device_list = [];

    let last_updated_time = null;
    
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

    async function update_acl_list() {
        acl_list = await bce_session.acls(true);
        if (acl_selected == "0" && acl_list.length > 0) {
            acl_selected = acl_list[0].acl_id;
        }
    }
    
    async function update_device_list() {
        device_list = await bce_session.device_list();
        last_updated_time = new Date()
    }
    
    async function update_all() {
        await update_acl_list()
        await update_device_list();
    }
    
    const interval = setInterval(update_device_list, 1000);
    
    onDestroy(() => clearInterval(interval));
    
    async function update_acl_selected() {        
    }
    
    async function on_click_use_acl(device_uid) {
        let success = await bce_session.device_update(device_uid, acl_selected);
        if (success) {
            $alert = bce_lang($user_language, "page_devices_alert_device_use_acl_success");
        } else {
            $alert = bce_lang($user_language, "page_devices_alert_device_use_acl_failure");
        }
    }

    let show_device_details = false;
    
    async function on_click_show_device_details() {
        show_device_details = true;
    }
    
    async function on_click_hide_device_details() {
        show_device_details = false;
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_devices_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>{bce_lang($user_language, "page_devices_title")}</h1>
  
  <label>
      {bce_lang($user_language, "page_devices_label_acl")}: 
      <select bind:value={acl_selected} on:change={update_acl_selected}>
	  <option value="0">
	      <i>{bce_lang($user_language, "page_devices_label_acl_none")}</i>
	  </option>
          {#each acl_list as acl}
	    <option value={acl.acl_id}>
	        {acl.display_name}
	    </option>
          {/each}
      </select>
  </label>
  
  <div>
      <table>
          <tr>
              <td>
                  current time:
              </td>
              <td>
                  {format_date(last_updated_time)}
              </td>
          </tr>
      </table>
  </div>
  
  {#if device_list.length > 0}
  <table>
        <tr>
            {#if show_device_details}
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_uid")}</i>
                </td>
            {/if}
            <td>
                <i>{bce_lang($user_language, "page_devices_label_email")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_acl")}</i>
            </td>
            <td>
            </td>
            {#if show_device_details}
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_last_heartbeat_time")}</i>
                </td>
            {/if}
            <td>
                <i>{bce_lang($user_language, "page_devices_label_time_since_last_heartbeat")}</i>
            </td>
            {#if show_device_details}
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_cpu_vendor_id")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_cpu_model name")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_nprocs")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_nprocs_conf")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_gl_version")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_gl_vendor")}</i>
                </td>
                <td>
                    <i>{bce_lang($user_language, "page_devices_label_gl_renderer")}</i>
                </td>
            {/if}
        </tr>
      {#each device_list as device}
        <tr>
            {#if show_device_details}
                <td>
                    {device.uid}
                </td>
            {/if}
            <td>
                {device.email}
            </td>
            <td>
                {get_acl_display_name_by_id(device.acl_id)}
            </td>
            <td>
                <a href="#" on:click|preventDefault={() => on_click_use_acl(device.uid)}>{bce_lang($user_language, "page_devices_label_use_acl")}</a>
            </td>
            {#if show_device_details}
                <td>
                    {format_json_datetime(device.last_heartbeat_time)}
                </td>
            {/if}
            <td>
                {format_time_since_json_datetime(device.last_heartbeat_time)}
            </td>
            {#if show_device_details}
                <td>
                    {device.cpu_vendor_id}
                </td>
                <td>
                    {device.cpu_model_name}
                </td>
                <td>
                    {device.nprocs}
                </td>
                <td>
                    {device.nprocs_conf}
                </td>
                <td>
                    {device.gl_version}
                </td>
                <td>
                    {device.gl_vendor}
                </td>
                <td>
                    {device.gl_renderer}
                </td>
            {/if}
        </tr>
      {/each}
  </table>
  
      {#if show_device_details}
          <a href="#" on:click|preventDefault={() => on_click_hide_device_details()}>{bce_lang($user_language, "page_devices_label_hide_device_details")}</a>
      {:else}
          <a href="#" on:click|preventDefault={() => on_click_show_device_details()}>{bce_lang($user_language, "page_devices_label_show_device_details")}</a>
      {/if}
  
  {/if}
  
{/if}


