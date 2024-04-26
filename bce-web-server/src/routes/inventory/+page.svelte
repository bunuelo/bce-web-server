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
    let new_product_quantity = 0;
    let new_product_sale_price = 0;
    let edit_product_id = null;
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
        products = await bce_inventory.products();
    });

    function on_input_quantity_change() {
      
    }

    function on_input_sale_price_change() {
      
    }

    async function update_product_list() {
        //products = null;
        //await delay(1);
        //await tick();
        products = await bce_inventory.products();
    }
    
    async function on_click_create_product() {
        console.log("async create: before create product.  name = \"" + new_product_name + "\"");
        let success = await bce_inventory.create_product(new_product_name, new_product_quantity, new_product_sale_price);
        console.log("async create: after create product.");
        if (success) {
            $alert = "Product created successfully!";
            new_product_name = "";
            new_product_quantity = 0;
            console.log("async create: before update product list.  " + JSON.stringify(products));
            await update_product_list();
            console.log("async create: after update product list.  " + JSON.stringify(products));
        } else {
            $alert = "Failed to create product.";
        }
    }

    async function on_click_edit_product(product_id) {
        console.log("edit: product_id = " + product_id);
        edit_product_id = product_id;
    }

    async function on_click_delete_product(id) {
        console.log("delete: id = " + id);
        let success = await bce_inventory.delete_product(id);
        if (success) {
            $alert = "Product deleted successfully!";
            await update_product_list();
        } else {
            $alert = "Failed to delete product.";
        }
    }

    async function on_click_save_product() {
        console.log("save: edit_product_id = " + edit_product_id);
        edit_product_id = null;
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
            <b>Sale Price</b>
        </td>
        <td>
        </td>
    </tr>
    {#key products}
      {#each products as product}
        <tr style="border: 1px solid black; border-collapse: collapse;">
            <td style="width: 600px; border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
    	          <input type="text" bind:value="{product.name}" style="width: 90%;" />
                {:else}
                  { product.name }
                {/if}
            </td>
            <td align="right" style="border: 1px solid black; border-collapse: collapse;">
                {#if edit_product_id == product.product_id}
	          <input type="number" bind:value="{product.quantity}" min=0 style="width: 90%;" on:change={on_input_quantity_change} />
                {:else}
                  { product.quantity }
                {/if}
            </td>
            <td align="right" style="border: 1px solid black; border-collapse: collapse;">
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
          <td style="width: 600px; border: 1px solid black; border-collapse: collapse;">
	      <input type="text" bind:value="{new_product_name}" style="width: 90%;" />
          </td>
          <td align="right" style="border: 1px solid black; border-collapse: collapse;">
	      <input type="number" bind:value="{new_product_quantity}" min=0 style="width: 90%;" />
          </td>
          <td align="right" style="border: 1px solid black; border-collapse: collapse;">
	      <input type="number" data-type="currency" bind:value="{new_product_sale_price}" min=0 style="width: 90%;" />
          </td>
          <td style="border: 0px;">
              <a href="#" on:click={on_click_create_product}>create</a>
          </td>
      </tr>
    {/if}
  </table>
{/if}
