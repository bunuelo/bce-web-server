<script lang="ts">
  import { onMount } from 'svelte';
  import Transition from 'svelte-transition'
  import Logo from './Logo.svelte'
  import Edit from './Edit.svelte'
  
  import BceSession from "./bce_session.js";

  let bce_session = new BceSession();

  let session_is_valid = false

  export async function load({ locals, params }) {
    params.branch;
    session_is_valid = await bce_session.session_is_valid();
  }
  
  //onMount(async () => {
  //  session_is_valid = await bce_session.session_is_valid()
  //});

</script>

<table>
  <tr>
    <td>
      Menu
    </td>
  </tr>
  <tr>
    <td>
      <table>
	<tr>
	  <td>
	    <a href="/">home</a>
	  </td>
	</tr>
        {#if session_is_valid}
          <tr>
	    <td>
	      <a href="/user/logout">logout</a>
	    </td>
	  </tr>
	{:else}
          <tr>
	    <td>
	      <a href="/user/login">login</a>
	    </td>
	  </tr>
	  <tr>
	    <td>
	      <a href="/user/create-account">create account</a>
	    </td>
	  </tr>
	{/if}
	<tr>
	  <td>
	    <a href="/docs">docs</a>
	  </td>
	</tr>
	<tr>
	  <td>
	    <a href="/terms">terms</a>
	  </td>
	</tr>
	<tr>
	  <td>
	    <a href="/contact">contact</a>
	  </td>
	</tr>
      </table>
    </td>
  </tr>
</table>

