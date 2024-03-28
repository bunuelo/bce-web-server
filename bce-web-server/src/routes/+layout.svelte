<script lang="ts">
  import Logo from './Logo.svelte'
  import Menu from './Menu.svelte'
</script>

<link rel="icon" href="/favicon.png?v=2" />

<table width="100%">
  <tr>
    <td>
      <table>
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
      </table>
    </td>
    <td>
      <slot />
    </td>
  </tr>
</table>

