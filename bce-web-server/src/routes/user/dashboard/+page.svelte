<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    
    let color_theme_selected = "dark";
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        $user_security_level = await bce_session.security_level();
        $user_color_theme = await bce_session.color_theme();
        color_theme_selected = $user_color_theme;
    });

    async function update_color_theme() {
        console.log("Update color theme.");
        var color_theme = color_theme_selected;
        var success = await bce_session.update(color_theme);
        $user_color_theme = await bce_session.color_theme();
        if ($user_color_theme == "light" || $user_color_theme == "dark") {
            document.documentElement.setAttribute("color-mode", $user_color_theme);
        }
    }
    </script>

<svelte:head>
    <title>User Dashboard</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>User Dashboard</h1>
  
  <label>
      Color Theme: 
      <select bind:value={color_theme_selected} on:change={update_color_theme}>
	  <option value="dark">
	      Dark
	  </option>
	  <option value="light">
	      Light
	  </option>
      </select>
  </label>
  
  {#if $user_security_level >= 25}
    <li>
	<a href="/user/acls">user ACLs</a>
    </li>
    <li>
        <a href="/user/assets">user assets</a>
    </li>
  {/if}
  
{/if}


