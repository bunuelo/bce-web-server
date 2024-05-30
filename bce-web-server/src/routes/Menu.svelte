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

<nav aria-labelledby="mainmenulabel">
    <div id="mainmenulabel" hidden>Main Menu</div>
    <ul>
        <li>
	    <a href="/">home</a>
        </li>
        {#if $user_session_is_valid}
          <li>
	      <a href="/user/logout">logout</a>
          </li>
          <li>
	      <a href="/user/dashboard">user dashboard</a>
              <ul>
                  {#if $user_security_level >= 25}
                    <li>
	                <a href="/user/acls">user ACLs</a>
                    </li>
                  <li>
                      <a href="/user/assets">user assets</a>
                  </li>
                {/if}
              </ul>
          </li>
        {:else}
          <li>
	      <a href="/user/login">login</a>
          </li>
          <li>
	      <a href="/user/create-account">create account</a>
          </li>
        {/if}
        {#if $user_security_level >= 25}
          <li>
	      <a href="/design">design</a>
          </li>
        {/if}
        {#if $user_security_level >= 100}
          <li>
	      <a href="/inventory">inventory</a>
          </li>
        {/if}
        <li>
            <a href="/docs">docs</a>
        </li>
        <li>
	    <a href="/terms">terms</a>
        </li>
        <li>
	    <a href="/contact">contact</a>
        </li>
    </ul>
</nav>

    
