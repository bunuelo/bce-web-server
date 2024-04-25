import { get } from 'svelte/store'
import { user_email } from './bce_stores.js'
import { user_session_token } from './bce_stores.js'
import { user_session_is_valid } from './bce_stores.js'
import { user_security_level } from './bce_stores.js'
import BceRestApi from "./bce_rest_api.js";
let bce_rest_api = new BceRestApi();

export default class BceInventory {
    
    constructor() {
    }

    async products() {
        console.log("[bce_inventory] products: before rest API.");
        let result = await bce_rest_api.inventory_products(get(user_email), get(user_session_token));
        console.log("[bce_inventory] products: after rest API.  result = " + JSON.stringify(result));
        return result;
    }

    async create_product(name, quantity, sale_price) {
        return await bce_rest_api.inventory_create_product(get(user_email), get(user_session_token), name, quantity, sale_price);
    }
  
    async delete_product(product_id) {
        return await bce_rest_api.inventory_delete_product(get(user_email), get(user_session_token), product_id);
    }
  
}
