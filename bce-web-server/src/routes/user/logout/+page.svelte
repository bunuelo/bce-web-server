<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { invalidate } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import BceRestApi from "$lib/bce_rest_api.js";
    import BceSession from "$lib/bce_session.js";
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { alert } from "$lib/bce_stores.js";
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    let bce_rest_api = new BceRestApi();
    let bce_session = new BceSession();
    
    onMount(async () => {
        bce_session.logout()
        $alert = bce_lang($user_language, "alert_logout_successful");
        goto("/user/dashboard");
    });
    
</script>

<h1>Logout</h1>

