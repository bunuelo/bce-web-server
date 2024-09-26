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
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();

    let acl_list = [];
    let acl_selected = "0";
    
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
        acl_list = await bce_session.acls();
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
    
    function format_date(date) {
        if (date == null) {
            return "";
        }
        function pad(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length-size);
        }
        let am_pm = date.getHours() < 12 ? "am" : "pm"
        let am_pm_hours = date.getHours() % 12
        var final_string = ""
        let now = new Date()
        if (now.getFullYear() != date.getFullYear()) {
            final_string += "" + date.getFullYear() + "-"
        }
        if (now.getDate() != date.getDate() || now.getMonth() != date.getMonth() || now.getFullYear() != date.getFullYear()) {
            final_string += pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) + " "
        }
        final_string += am_pm_hours + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2) + " " + am_pm
        return final_string
    }
    
    function format_time_since_date(date) {
        if (date == null) {
            return "";
        }
        function pad(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length-size);
        }
      var final_string = ""
      let now = new Date()
      let total_seconds = (now.getTime() - date.getTime()) / 1000.0
      final_string += "" + Math.round(total_seconds) + "s"
      return final_string
    }
    
    function format_json_datetime(json_datetime) {
        let date = new Date(json_datetime + "Z")
        return format_date(date)
    }
    
    function format_time_since_json_datetime(json_datetime) {
        let date = new Date(json_datetime + "Z")
        return format_time_since_date(date)
    }
    
    async function update_acl_selected() {
    }
    
    async function on_click_use_acl(device_uid) {
        
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
  
  <table>
      <tr>
          <td>
              Current time:
          </td>
          <td>
              {format_date(last_updated_time)}
          </td>
      </tr>
  </table>
  
  {#if device_list.length > 0}
  <table>
        <tr>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_uid")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_acl")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_last_heartbeat_time")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_time_since_last_heartbeat")}</i>
            </td>
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
        </tr>
      {#each device_list as device}
        <tr>
            <td>
                {device.uid}
            </td>
            <td>
                {device.acl_id}
                <a href="#" on:click={() => on_click_use_acl(device.uid)}>{bce_lang($user_language, "page_devices_label_use_acl")}</a>
            </td>
            <td>
                {format_json_datetime(device.last_heartbeat_time)}
            </td>
            <td>
                {format_time_since_json_datetime(device.last_heartbeat_time)}
            </td>
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
        </tr>
      {/each}
  </table>
  {/if}
  
{/if}


