<script lang="ts">
    import { onMount } from 'svelte';
    import Transition from 'svelte-transition'
    import Logo from './Logo.svelte'
    import Edit from './Edit.svelte'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import BceSession from "$lib/bce_session.js";
    
    let bce_session = new BceSession();
    
    onMount(async () => {
        $user_session_is_valid = await bce_session.session_is_valid();
        $user_security_level = await bce_session.security_level();
    });
    
</script>

<table>
    <tr>
        <td>
            Menu
        </td>
    </tr>
    <tr>
        <td>
            <table>
	        <tr>
	            <td>
	                <a href="/">home</a>
	            </td>
	        </tr>
                {#if $user_session_is_valid}
  	          <tr>
	              <td>
	                  <a href="/user/dashboard">dashboard</a>
	              </td>
	          </tr>
                  <tr>
	              <td>
	                  <a href="/user/logout">logout</a>
	              </td>
	          </tr>
	        {:else}
                  <tr>
	              <td>
	                  <a href="/user/login">login</a>
	              </td>
	          </tr>
	          <tr>
	              <td>
	                  <a href="/user/create-account">create account</a>
	              </td>
	          </tr>
	        {/if}
                {#if $user_security_level >= 25}
	        <tr>
	            <td>
	                <a href="/design">design</a>
	            </td>
	        </tr>
	        {/if}
                {#if $user_security_level >= 100}
	        <tr>
	            <td>
	                <a href="/inventory">inventory</a>
	            </td>
	        </tr>
	        {/if}
	        <tr>
	            <td>
	                <a href="/docs">docs</a>
	            </td>
	        </tr>
	        <tr>
	            <td>
	                <a href="/terms">terms</a>
	            </td>
	        </tr>
	        <tr>
	            <td>
	                <a href="/contact">contact</a>
	            </td>
	        </tr>
            </table>
        </td>
    </tr>
</table>

