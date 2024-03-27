<script lang="ts">
  import Logo from './Logo.svelte'
  import Menu from './Menu.svelte'
  
</script>

<Logo />

<Menu />

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

