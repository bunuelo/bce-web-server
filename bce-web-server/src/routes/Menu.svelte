<script lang="ts">
  import { createMenu } from 'svelte-headlessui'
  import Transition from 'svelte-transition'
  import Logo from './Logo.svelte'
  import Edit from './Edit.svelte'
  
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
	<tr>
	  <td>
	    <a href="/login">login</a>
	  </td>
	</tr>
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

