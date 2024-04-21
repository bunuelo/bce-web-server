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
      return ["blah", "blah", "blah"]
    }
  
}
