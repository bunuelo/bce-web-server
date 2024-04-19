<script lang="ts">
  import Logo from './Logo.svelte'
  import Menu from './Menu.svelte'
  import { alert } from './bce_stores.js'
  import { onDestroy } from 'svelte'
  
  let alertContent = ''
  
  const unsubscribe = alert.subscribe((value) => alertContent = value)
  
  onDestroy(unsubscribe)
  
</script>

<link rel="icon" href="/favicon.png?v=2" />

{#if alertContent}
<div on:click={() => alertContent = ''}>
  <p>{ alertContent }</p>
</div>
{/if}

<table width="100%">
  <tr>
    <td>
      <Logo />
    </td>
  <tr>
  </tr>
  <tr>
    <td>
      <Menu />
    </td>
  </tr>
  <tr>
    <td>
      <slot />
    </td>
  </tr>
</table>

