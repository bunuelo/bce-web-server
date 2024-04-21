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

    function on_input_change() {
      
    }
</script>

{#if products}
  <h1>Inventory</h1>

  <table style="border-collapse: collapse;">
    <tr>
        <td>
            <b>Product Name</b>
        </td>
        <td>
            <b>Quantity</b>
        </td>
    </tr>
  {#each products as product}
    <tr style="border: 1px solid black; border-collapse: collapse;">
        <td style="border: 1px solid black; border-collapse: collapse;">
            { product.name }
        </td>
        <td style="border: 1px solid black; border-collapse: collapse;">
	    <input type="number" bind:value="{product.quantity}" min=0 style="width: 50px;" on:change={on_input_change} />
        </td>
    </tr>
  {/each}
  </table>
{/if}
  
