<script lang="ts">
    import Logo from './Logo.svelte'
    import Menu from './Menu.svelte'
    import { alert } from '$lib/bce_stores.js'
      
</script>

<style>
    :global(body) {
      background-color: #000000;
      color: #ffffff;
      transition: background-color 0.3s
    }
</style>

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

