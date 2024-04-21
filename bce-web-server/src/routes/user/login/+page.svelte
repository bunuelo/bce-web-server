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
    let bce_rest_api = new BceRestApi();
    let bce_session = new BceSession();
    
    let password;
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if ($user_session_is_valid) {
            goto("/user/dashboard", { invalidateAll: true });
        }
    });
  
  async function login() {
      console.log("Login: here.");
      $user_session_token = await bce_rest_api.user_login($user_email, password);
      if ($user_session_token != null) {
          console.log("Login: session_token = " + $user_session_token);
          $user_session_is_valid = true;
          $user_security_level = await bce_rest_api.user_security_level($user_email, $user_session_token);
          $alert = "Login successful!";
          goto("/user/dashboard", { invalidateAll: true });
      } else {
          $user_email = "";
          password = "";
          $alert = "Login failed.";
          console.log("Login failed.");
      }
  }
  
</script>

<h1>Login</h1>

<table>
  <tr>
    <td>
      email:
    </td>
    <td>
      <input type="email" bind:value={$user_email}>
    </td>
  </tr>
  <tr>
    <td>
      password:
    </td>
    <td>
      <input type="password" bind:value={password}>
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
