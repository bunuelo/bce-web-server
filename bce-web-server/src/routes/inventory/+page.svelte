<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import BceInventory from "$lib/bce_inventory.js";
    let bce_inventory = new BceInventory();
    
    let products = null;
    let new_product_name = "";
    let new_product_quantity = 0;
    
    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
        products = await bce_inventory.products();
    });

    function on_input_change() {
      
    }

    function on_click_create_product() {
        console.log("create: here.");
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
        <td>
        </td>
    </tr>
    <tr style="border: 1px solid black; border-collapse: collapse;">
        <td style="border: 1px solid black; border-collapse: collapse;">
	    <input type="text" bind:value="{new_product_name}" style="width: 90%;" />
        </td>
        <td align="right" style="border: 1px solid black; border-collapse: collapse;">
	    <input type="number" bind:value="{new_product_quantity}" min=0 style="width: 90%;" />
        </td>
        <td style="border: 0px;">
            <div on:click={on_click_create_product} style="cursor: pointer;">
                create
            </div>
        </td>
    </tr>
  {#each products as product}
    <tr style="border: 1px solid black; border-collapse: collapse;">
        <td style="border: 1px solid black; border-collapse: collapse;">
            { product.name }
        </td>
        <td align="right" style="border: 1px solid black; border-collapse: collapse;">
	    <input type="number" bind:value="{product.quantity}" min=0 style="width: 90%;" on:change={on_input_change} />
        </td>
        <td style="border: 0px;">
            edit
        </td>
    </tr>
  {/each}
  </table>
{/if}
  
