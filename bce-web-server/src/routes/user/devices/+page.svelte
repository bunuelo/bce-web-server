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
    
    let device_list = [];

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

    async function update_device_list() {
        device_list = await bce_session.device_list();
    }
    
    async function update_all() {
        await update_device_list();
    }
    
    function format_json_datetime(json_datetime) {
        let now = new Date()
        let date = new Date(json_datetime + "Z")
        function pad(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length-size);
        }
        let am_pm = date.getHours() < 12 ? "am" : "pm"
        let am_pm_hours = date.getHours() % 12
        var final_string = ""
        if (now.getFullYear() != date.getFullYear()) {
            final_string += "" + date.getFullYear() + "-"
        }
        if (now.getDate() != date.getDate() || now.getMonth() != date.getMonth() || now.getFullYear() != date.getFullYear()) {
            final_string += pad(date.getMonth() + 1, 2) + "-" + pad(date.getDate(), 2) + " "
        }
        final_string += am_pm_hours + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2) + " " + am_pm
        return final_string
    }
    
</script>


<svelte:head>
    <title>{bce_lang($user_language, "page_devices_title")}</title>
</svelte:head>

{#if $user_session_is_valid && $user_security_level >= 25}

  <h1>{bce_lang($user_language, "page_devices_title")}</h1>
    
  {#if device_list.length > 0}
  <table>
        <tr>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_device_id")}</i>
            </td>
            <td>
                <i>{bce_lang($user_language, "page_devices_label_last_heartbeat_time")}</i>
            </td>
        </tr>
      {#each device_list as device}
        <tr>
            <td>
                {device.device_id}
            </td>
            <td>
                {format_json_datetime(device.last_heartbeat_time)}
            </td>
        </tr>
      {/each}
  </table>
  {/if}
  
{/if}


