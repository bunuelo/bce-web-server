<script lang="ts">
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import Design from "./Design.svelte";

    let access_granted = false;
    
    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
        access_granted = true;                           
    });

</script>

{#if access_granted}
<Design />
{/if}
