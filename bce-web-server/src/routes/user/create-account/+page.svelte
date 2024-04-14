<script>
  import BceRestApi from "./bce_rest_api.js";
  let bce_rest_api = new BceRestApi();

  let email = "";
  let password = "";
  
  function create_account() {
    console.log("Create account: here.")
    bce_rest_api.user_create_account(
  }
</script>

<h1>Create Account</h1>

<table>
  <tr>
    <td>
      email:
    </td>
    <td>
      <input type="email">
    </td>
  </tr>
  <tr>
    <td>
      password:
    </td>
    <td>
      <input type="password">
    </td>
  </tr>
  <tr>
    <td>
      confirm password:
    </td>
    <td>
      <input type="password">
    </td>
  </tr>
  <tr>
    <td>
    </td>
    <td>
      <button type="button" on:click={create_account}>Create Account</button>
    </td>
  </tr>
</table>
