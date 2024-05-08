<script>
    import { onMount } from 'svelte';
    import { tick } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import BceInventory from "$lib/bce_inventory.js";
    let bce_inventory = new BceInventory();

    let products = null;
    let new_product_name = "";
    let new_product_display_name = "";
    let new_product_url = "";
    let new_product_quantity = 0;
    let new_product_sale_price = 0;
    let edit_product_id = null;
    
    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
        products = await bce_inventory.products();
    });

    function reset_new_product() {
        new_product_name = "";
        new_product_display_name = "";
        new_product_url = "";
        new_product_quantity = 0;
        new_product_sale_price = 0;
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function on_input_quantity_change() {
      
    }

    function on_input_sale_price_change() {
      
    }

    async function update_product_list() {
        products = await bce_inventory.products();
    }
    
    async function on_click_create_product() {
        let success = await bce_inventory.create_product(new_product_name, new_product_display_name, new_product_url, new_product_quantity, new_product_sale_price);
        if (success) {
            $alert = "Product created successfully!";
            reset_new_product();
            await update_product_list();
        } else {
            $alert = "Failed to create product.";
        }
    }

    async function on_click_edit_product(product_id) {
        edit_product_id = product_id;
    }

    async function on_click_delete_product(id) {
        let success = await bce_inventory.delete_product(id);
        if (success) {
            $alert = "Product deleted successfully!";
            await update_product_list();
        } else {
            $alert = "Failed to delete product.";
        }
    }

    async function on_click_save_product() {
        edit_product_id = null;
    }

    async function on_click_ingest_products() {
        await bce_inventory.ingest_products();
        await update_product_list();
    }

</script>

<svelte:head>
    <title>Inventory</title>
</svelte:head>

{#if products}
  <h1>Inventory</h1>

  <a href="#" on:click={on_click_ingest_products}>ingest products</a>
  
  <table style="border-collapse: collapse;">
    <tr>
        <td>
            <b>Name</b>
        </td>
        <td>
            <b>Display Name</b>
        </td>
        <td>
            <b>URL</b>
        </td>
        <td>
            <b>Quantity</b>
        </td>
        <td>
            <b>Sale Price</b>
        </td>
        <td>
        </td>
    </tr>
    {#key products}
      {#each products as product}
        <tr style="border: 1px solid black; border-collapse: collapse;">
            <td style="width: 200px; border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
    	          <input type="text" bind:value="{product.name}" style="width: 90%;" />
                {:else}
                  { product.name }
                {/if}
            </td>
            <td style="width: 600px; border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
    	          <input type="text" bind:value="{product.display_name}" style="width: 90%;" />
                {:else}
                  { product.display_name }
                {/if}
            </td>
            <td style="width: 200px; border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
    	          <input type="text" bind:value="{product.url}" style="width: 90%;" />
                {:else}
                  {#if product.url != ""}
                    <a href="{product.url}">source</a>
                  {/if}
                {/if}
            </td>
            <td align="right" style="width: 50px; border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
	          <input type="number" bind:value="{product.quantity}" min=0 style="width: 90%;" on:change={on_input_quantity_change} />
                {:else}
                  { product.quantity }
                {/if}
            </td>
            <td align="right" style="width: 75px; border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
	          <input type="number" data-type="currency" bind:value="{product.sale_price}" min=0 style="width: 90%;" on:change={on_input_sale_price_change} />
                {:else}
                  { product.sale_price }
                {/if}
            </td>
            <td style="border: 0px;">
                {#if edit_product_id == null}
                  <a href="#" on:click={() => on_click_edit_product(product.product_id)}>edit</a>
                  <a href="#" on:click={() => on_click_delete_product(product.product_id)}>delete</a>
                {:else if edit_product_id == product.product_id}
                  <a href="#" on:click={on_click_save_product}>save</a>
                {/if}
            </td>
        </tr>
      {/each}
    {/key}
    {#if edit_product_id == null}
      <tr style="border: 1px solid black; border-collapse: collapse;">
          <td style="width: 200px; border: 1px solid black; border-collapse: collapse;">
	      <input type="text" bind:value="{new_product_name}" style="width: 90%;" />
          </td>
          <td style="width: 600px; border: 1px solid black; border-collapse: collapse;">
	      <input type="text" bind:value="{new_product_display_name}" style="width: 90%;" />
          </td>
          <td style="width: 200px; border: 1px solid black; border-collapse: collapse;">
	      <input type="text" bind:value="{new_product_url}" style="width: 90%;" />
          </td>
          <td align="right" style="width: 50px; border: 1px solid black; border-collapse: collapse;">
	      <input type="number" bind:value="{new_product_quantity}" min=0 style="width: 90%;" />
          </td>
          <td align="right" style="width: 75px; border: 1px solid black; border-collapse: collapse;">
	      <input type="number" data-type="currency" bind:value="{new_product_sale_price}" min=0 style="width: 90%;" />
          </td>
          <td style="border: 0px;">
              <a href="#" on:click={on_click_create_product}>create</a>
          </td>
      </tr>
    {/if}
  </table>
{/if}
