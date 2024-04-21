<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import BceInventory from "$lib/bce_inventory.js";
    let bce_inventory = new BceInventory();
    
    let products = null;

    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
        products = await bce_inventory.products();
    });
</script>

{#if products}
<h1>Inventory</h1>

<p> { products } </p>
{/if}

