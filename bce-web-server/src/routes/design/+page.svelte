<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import Design from "./Design.svelte";

    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 25) {
            goto("/user/dashboard");
        }
    });

</script>

<svelte:head>
    <title>{bce_lang($user_language, "page_design_title")}</title>
</svelte:head>

{#if $user_security_level >= 25}
<Design />
{/if}
