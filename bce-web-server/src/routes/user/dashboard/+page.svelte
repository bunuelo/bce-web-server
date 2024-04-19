<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_session_is_valid } from '../../bce_stores.js'
    
    let password;
    
    onMount(async () => {
        $user_session_is_valid = await bce_session.session_is_valid()
        if ($user_session_is_valid) {
            goto("/user/dashboard");
        }
    });
</script>
  
<h1>User Dashboard</h1>


