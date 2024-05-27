<script lang="ts">
    import { onMount } from 'svelte';
    import Logo from './Logo.svelte'
    import Menu from './Menu.svelte'
    import { alert } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    
    onMount(async () => {
        $user_color_theme = await bce_session.color_theme()
        document.documentElement.style.setProperty("color-mode", "light");
    });

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

