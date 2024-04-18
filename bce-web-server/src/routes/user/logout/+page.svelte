<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { invalidateAll } from '$app/navigation';
  import BceRestApi from "../../bce_rest_api.js";
  import BceSession from "../../bce_session.js";
  let bce_rest_api = new BceRestApi();
  let bce_session = new BceSession();

  onMount(async () => {
    bce_session.set_cookie("email", "", -1);
    bce_session.set_cookie("session_token", "", -1);
    goto("/", { invalidateAll: true });
  });
  
</script>

<h1>Logout</h1>

