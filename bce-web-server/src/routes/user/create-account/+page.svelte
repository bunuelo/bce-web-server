<script>
  import { redirect } from '@sveltejs/kit';
  import BceRestApi from "../../bce_rest_api.js";
  let bce_rest_api = new BceRestApi();

  let email = "";
  let password = "";
  let confirm_password = "";
  
  async function create_account() {
    console.log("Create account: here.");
    let success = await bce_rest_api.user_create_account(email, password);
    console.log("Create account: success = " + success);
    throw redirect(303, '/user/login');
  }
</script>

<h1>Create Account</h1>

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
      confirm password:
    </td>
    <td>
      <input type="password" bind:value={confirm_password}>
    </td>
  </tr>
  <tr>
    <td>
      {#if email == ""}
      <p>⚠ Please enter valid email. ⚠</p>
      {/if}
      {#if password != confirm_password}
      <p>⚠ Please enter matching passwords. ⚠</p>
      {/if}
    </td>
    <td>
      {#if email != "" && password != "" && password == confirm_password}
      <button type="button" on:click={create_account}>Create Account</button>
      {:else}
      <button type="button" disabled>Create Account</button>
      {/if}
    </td>
  </tr>
</table>
