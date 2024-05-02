<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import { user_security_level } from '$lib/bce_stores.js'
    import Design from "./Design.svelte";

    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 25) {
            goto("/user/dashboard");
        }
    });

</script>

{#if $user_security_level >= 25}
<Design />
{/if}
