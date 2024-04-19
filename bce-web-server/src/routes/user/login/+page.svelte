<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import BceRestApi from "../../bce_rest_api.js";
  import BceSession from "../../bce_session.js";
  let bce_rest_api = new BceRestApi();
  let bce_session = new BceSession();

  let email = "";
  let password = "";
  
  onMount(async () => {
    let session_is_valid = await bce_session.session_is_valid()
    if (session_is_valid) {
      goto("/", { invalidateAll: true });
    }
  });
  
  async function login() {
    console.log("Login: here.");
    let session_token = await bce_rest_api.user_login(email, password);
    if (session_token != null) {
      console.log("Login: session_token = " + session_token);
      bce_session.set_cookie("email", email, 1);
      bce_session.set_cookie("session_token", session_token, 1);
      session_is_valid = true;
      goto("/");
    } else {
      email = "";
      password = "";
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
      <input type="email" bind:value={email}>
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
