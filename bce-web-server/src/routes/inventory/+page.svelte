<script>
    import { onMount } from 'svelte';
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
    let edit_id = null;
    
    onMount(async () => {
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 100) {
            goto("/user/dashboard");
        }
        products = await bce_inventory.products();
    });

    function on_input_change() {
      
    }

    async function on_click_create_product() {
        console.log("async create: here.");
        let success = bce_inventory.create_product(new_product_name, new_product_quantity);
        if (success) {
            $alert = "Product created successfully!";
            new_product_name = "";
            new_product_quantity = 0;
        } else {
            $alert = "Failed to create product.";
        }
        products = await bce_inventory.products();
    }

    async function on_click_edit_product(id) {
        console.log("edit: id = " + id);
        edit_id = id;
    }

    async function on_click_delete_product(id) {
        console.log("delete: id = " + id);
    }

    async function on_click_save_product() {
        console.log("save: edit_id = " + edit_id);
        edit_id = null;
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
    {#key products}
      {#each products as product}
        <tr style="border: 1px solid black; border-collapse: collapse;">
            <td style="border: 1px solid black; border-collapse: collapse;">
                {#if edit_id == product.id}
    	          <input type="text" bind:value="{product.name}" style="width: 90%;" />
                {:else}
                  { product.name }
                {/if}
            </td>
            <td align="right" style="border: 1px solid black; border-collapse: collapse;">
                {#if edit_id == product.id}
	          <input type="number" bind:value="{product.quantity}" min=0 style="width: 90%;" on:change={on_input_change} />
                {:else}
                  { product.quantity }
                {/if}
              </td>
            <td style="border: 0px;">
                {#if edit_id == null}
                  <a href="#" on:click={() => on_click_edit_product(product.id)}>edit</a>
                  <a href="#" on:click={() => on_click_delete_product(product.id)}>delete</a>
                {:else if edit_id == product.id}
                  <a href="#" on:click={on_click_save_product}>save</a>
                {/if}
              </td>
        </tr>
      {/each}
    {/key}
    {#if edit_id == null}
      <tr style="border: 1px solid black; border-collapse: collapse;">
          <td style="border: 1px solid black; border-collapse: collapse;">
	      <input type="text" bind:value="{new_product_name}" style="width: 90%;" />
          </td>
          <td align="right" style="border: 1px solid black; border-collapse: collapse;">
	      <input type="number" bind:value="{new_product_quantity}" min=0 style="width: 90%;" />
          </td>
          <td style="border: 0px;">
              <a href="#" on:click={on_click_create_product}>create</a>
          </td>
      </tr>
    {/if}
  </table>
{/if}

