<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import BceRestApi from "$lib/bce_rest_api.js";
  import BceSession from "$lib/bce_session.js";
  import { alert } from "$lib/bce_stores.js";
  let bce_rest_api = new BceRestApi();
  let bce_session = new BceSession();

  let email = "";
  let password = "";
  let confirm_password = "";
  
  onMount(async () => {
    let session_is_valid = await bce_session.session_is_valid()
    if (session_is_valid) {
      goto("/", { invalidateAll });
    }
  });
  
  async function create_account() {
    console.log("Create account: here.");
    let success = await bce_rest_api.user_create(email, password);
    console.log("Create account: success = " + success);
    if (success) {
      $alert = "Acount created successfully!";
      goto("/user/login", { invalidateAll });
    } else {
      $alert = "Acount creation failed.  Maybe you already have an account?";
    }
  }
</script>

<svelte:head>
    <title>Create Account</title>
</svelte:head>

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
