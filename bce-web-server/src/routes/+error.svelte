<script>
  import { page } from '$app/stores';
</script>

<h1>Page does not exist</h1>

<p>Error code #{$page.status}, "{$page.error.message}".</p>

<p>Please either use your browser's back button or use the nagitation
menu on the left.</p>
