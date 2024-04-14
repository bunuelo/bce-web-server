<script>
  import BceRestApi from "../../bce_rest_api.js";
  let bce_rest_api = new BceRestApi();

  let email = "";
  let password = "";
  let confirm_password = "";
  
  function create_account() {
    console.log("Create account: here.");
    bce_rest_api.user_create_account(email, password);
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
      {#if password != confirm_password}
      ⚠ Passwords do not match. ⚠
      {/if}
    </td>
    <td>
      {#if password != "" && password == confirm_password}
      <button type="button" on:click={create_account}>Create Account</button>
      {:else}
      <button type="button" disabled>Create Account</button>
      {/if}
    </td>
  </tr>
</table>
