<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '../../bce_stores.js'
    import BceSession from "../../bce_session.js";
    let bce_session = new BceSession();
    
    let password;
    
    onMount(async () => {
        $user_session_is_valid = await bce_session.session_is_valid()
        if ($user_session_is_valid) {
            goto("/user/dashboard");
        }
    });
</script>
  
<h1>User Dashboard</h1>


