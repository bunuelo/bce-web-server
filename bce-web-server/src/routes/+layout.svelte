<script lang="ts">
  import Logo from './Logo.svelte'
  import Menu from './Menu.svelte'

  let session_is_valid = false

</script>

<link rel="icon" href="/favicon.png?v=2" />

<table width="100%">
  <tr>
    <td>
      <Logo />
    </td>
  <tr>
  </tr>
  <tr>
    <td>
      <Menu session_is_valid={session_is_valid} />
    </td>
  </tr>
  <tr>
    <td>
      <slot session_is_valid={session_is_valid} />
    </td>
  </tr>
</table>

