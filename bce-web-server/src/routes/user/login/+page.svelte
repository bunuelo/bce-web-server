<script>
  import BceRestApi from "../../bce_rest_api.js";
  let bce_rest_api = new BceRestApi();

  let email = "";
  let password = "";
  
  async function login() {
    console.log("Login: here.");
    let success = await bce_rest_api.user_login(email, password);
    console.log("Login: success = " + success);
    //if (success) {
    //  goto("/user/login");
    //}
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
