<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    
    onMount(async () => {
        if ($user_security_level >= 100) {
            $user_security_level = await bce_session.user_security_level()
        }
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
    });
</script>

<h1>Inventory</h1>


