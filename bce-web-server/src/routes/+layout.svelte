<script lang="ts">
  import Logo from './Logo.svelte'
  import Menu from './Menu.svelte'
  import { alert } from '$lib/bce_stores.js'
  
</script>

<link rel="icon" href="/favicon.png?v=2" />

{#if $alert}
<div on:click={() => $alert = ''}>
  <p>{ $alert }</p>
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

