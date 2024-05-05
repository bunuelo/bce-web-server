<script lang="ts">
    import Logo from './Logo.svelte'
    import Menu from './Menu.svelte'
    import { page_title } from '$lib/bce_stores.js'
    import { alert } from '$lib/bce_stores.js'
      
    $page_title = "BCE";

</script>

<svelte:head>
    <title>{page_title}</title>
</svelte:head>

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

