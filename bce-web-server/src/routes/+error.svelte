<script>
  import { page } from '$app/stores';
</script>

{#if page.status == 404}
<h1>Page does not exist</h1>
{+else}
<h1>Something went wrong</h1>
{/if}

<p>Error code #{$page.status}, "{$page.error.message}".</p>

<p>Please either use your browser's back button or use the nagitation
menu on the left.</p>
