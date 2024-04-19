<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { invalidate } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import BceRestApi from "../../bce_rest_api.js";
  import BceSession from "../../bce_session.js";
  import { user_session_is_valid } from '../../bce_stores.js'
  let bce_rest_api = new BceRestApi();
  let bce_session = new BceSession();

  onMount(async () => {
    bce_session.logout()
    $user_session_is_valid = false;
    goto("/", { invalidateAll: true });
  });
  
</script>

<h1>Logout</h1>

