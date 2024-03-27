<script lang="ts">
  import { createMenu } from 'svelte-headlessui'
  import Transition from 'svelte-transition'
  import Event from 'svelte'
  
  const menu = createMenu({ label: 'Actions' })

  function onSelect(e: Event) {
    console.log("select", (e as CustomEvent).detail)
  }
  
</script>


<table width="100%">
  <tr>
    <td width="100%">
      <nav>
	<a href="/">home</a>
	<a href="/terms">terms</a>
	<a href="/contact">contact</a>
      </nav>
    </td>
  </tr>
  <tr>
    <td width="100%">
      <slot />
    </td>
  </tr>
</table>

