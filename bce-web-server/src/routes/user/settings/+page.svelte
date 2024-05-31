<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid, user_security_level, user_color_theme, user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
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
        color_theme_selected = $user_color_theme;
        $user_language = await bce_session.language();
        language_selected = $user_language;
    });

    async function update_color_theme() {
        var color_theme = color_theme_selected;
        console.log("Update color theme: \"" + color_theme + "\"");
        var success = await bce_session.update({"color_theme": color_theme});
        $user_color_theme = await bce_session.color_theme();
        if ($user_color_theme == "light" || $user_color_theme == "dark") {
            document.documentElement.setAttribute("color-mode", $user_color_theme);
        }
    }

    async function update_language() {
        var language = language_selected;
        console.log("Update language: \"" + language + "\"");
        var success = await bce_session.update({"language": language});
        $user_language = await bce_session.language();
    }
</script>

<svelte:head>
    <title>{bce_lang($user_language, "page_settings_title")}</title>
</svelte:head>

{#if $user_session_is_valid}

  <h1>{bce_lang($user_language, "page_settings_title")}</h1>
  
  <ul>
      {#if $user_security_level >= 25}
        <li>
            <label>
                {bce_lang($user_language, "page_settings_label_color_theme")}: 
                <select bind:value={color_theme_selected} on:change={update_color_theme}>
	            <option value="">
	                {bce_lang($user_language, "page_settings_label_system_default_color_theme")}
	            </option>
	            <option value="dark">
	                {bce_lang($user_language, "page_settings_label_dark_color_theme")}
	            </option>
	            <option value="light">
	                {bce_lang($user_language, "page_settings_label_light_color_theme")}
	            </option>
                </select>
            </label>
        </li>
        <li>
            <label>
                {bce_lang($user_language, "page_settings_label_language")}: 
                <select bind:value={language_selected} on:change={update_language}>
	            <option value="">
	                {bce_lang($user_language, "page_settings_label_system_default_language")}
	            </option>
	            <option value="en">
	                English Language
	            </option>
	            <option value="es">
	                Lengua Española
	            </option>
	            <option value="ja">
	                日本語
	            </option>
	            <option value="ru">
	                Русский язык
	            </option>
	            <option value="uk">
	                Українська мова
	            </option>
	            <option value="zh">
                        中文
	            </option>
                </select>
            </label>
        </li>
    {/if}
  </ul>
  
{/if}


