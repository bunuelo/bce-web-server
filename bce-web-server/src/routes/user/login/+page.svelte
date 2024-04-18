<script>
  import { onMount } from 'svelte';
  import BceRestApi from "../../bce_rest_api.js";
  import BceSession from "../../bce_session.js";
  let bce_rest_api = new BceRestApi();
  let bce_session = new BceSession();

  let email = "";
  let password = "";
  let session_token = "";
  
  onMount(async () => {
    session_token = bce_session.get_cookie("session_token")
  });
  
  async function login() {
    console.log("Login: here.");
    session_token = await bce_rest_api.user_login(email, password);
    if (session_token != null) {
      console.log("Login: session_token = " + session_token);
      bce_session.set_cookie("session_token", session_token, 1);
    } else {
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
  <tr>
    <td>
    </td>
    <td>
      Session Token: {session_token}
    </td>
  </tr>
</table>
