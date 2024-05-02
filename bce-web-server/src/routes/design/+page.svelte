<script lang="ts">
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
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
