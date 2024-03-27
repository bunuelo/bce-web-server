<script lang="ts">
  import Logo from './Logo.svelte'
  import Menu from './Menu.svelte'
  
</script>


<table width="100%">
  <tr>
    <td>
      <Logo />
      <Menu />
      <nav>
	<a href="/">home</a>
	<a href="/terms">terms</a>
	<a href="/contact">contact</a>
      </nav>
    </td>
    <td>
      <slot />
    </td>
  </tr>
</table>

