<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    
    let color_theme_selected = "";
    let language_selected = "";
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        $user_security_level = await bce_session.security_level();
        $user_color_theme = await bce_session.color_theme();
        //$user_language = await bce_session.language();
        color_theme_selected = $user_color_theme;
    });

    async function update_color_theme() {
        var color_theme = color_theme_selected;
        console.log("Update color theme: \"" + color_theme + "\"");
        var success = await bce_session.update(color_theme);
        $user_color_theme = await bce_session.color_theme();
        if ($user_color_theme == "light" || $user_color_theme == "dark") {
            document.documentElement.setAttribute("color-mode", $user_color_theme);
        }
    }

    async function update_language() {
        var language = language_selected;
        console.log("Update language: \"" + language + "\"");
        var success = await bce_session.update(language);
        $user_language = await bce_session.language();
    }
</script>

<svelte:head>
    <title>Settings</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>Settings</h1>
  
  <ul>
      {#if $user_security_level >= 25}
        <li>
            <label>
                color theme: 
                <select bind:value={color_theme_selected} on:change={update_color_theme}>
	            <option value="">
	                System Default
	            </option>
	            <option value="dark">
	                Dark
	            </option>
	            <option value="light">
	                Light
	            </option>
                </select>
            </label>
        </li>
        <li>
            <label>
                language: 
                <select bind:value={language_selected} on:change={update_language}>
	            <option value="">
	                System Default
	            </option>
	            <option value="en">
	                English
	            </option>
	            <option value="es">
	                Español
	            </option>
	            <option value="ja">
	                日本語
	            </option>
                </select>
            </label>
        </li>
    {/if}
  </ul>
  
{/if}


