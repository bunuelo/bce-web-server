<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import BceRestApi from "$lib/bce_rest_api.js";
    import BceSession from "$lib/bce_session.js";
    import { alert } from "$lib/bce_stores.js";
    import { user_email } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    let bce_rest_api = new BceRestApi();
    let bce_session = new BceSession();

    let password;

    let user_email_input;
    let password_input;
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if ($user_session_is_valid) {
            goto("/user/dashboard", { invalidateAll: true });
        }

        user_email_input.addEventListener("keyup", async function (event) {
            if (event.key === "Enter") {
                console.log('user_email: Enter key pressed');
                await login();
            }
        });

        password_input.addEventListener("keyup", async function (event) {
            if (event.key === "Enter") {
                console.log('password: Enter key pressed');
                await login();
            }
        });
    });
  
    async function login() {
        $user_session_token = await bce_rest_api.user_login($user_email, password);
        if ($user_session_token != null) {
            bce_session.login($user_email, $user_session_token);
            $user_session_is_valid = true;
            $user_security_level = await bce_session.security_level();
            $alert = bce_lang($user_language, "page_login_alert_login_successful");
            $user_color_theme = await bce_session.color_theme();
            goto("/user/dashboard", { invalidateAll: true });
        } else {
            $user_email = "";
            password = "";
            $alert = "Login failed.";
        }
    }

    
</script>

<svelte:head>
    <title>{bce_lang($user_language, "page_login_title")}</title>
</svelte:head>

<h1>{bce_lang($user_language, "page_login_title")}</h1>

<table>
    <tr>
        <td>
            {bce_lang($user_language, "page_login_label_email")}:
        </td>
        <td>
            <input bind:this={user_email_input} type="email" bind:value={$user_email}>
        </td>
    </tr>
    <tr>
        <td>
            {bce_lang($user_language, "page_login_label_password")}:
        </td>
        <td>
            <input bind:this={password_input} type="password" bind:value={password}>
        </td>
    </tr>
    <tr>
        <td>
        </td>
        <td>
            <button type="button" on:click={login}>Login</button>
        </td>
    </tr>
</table>
