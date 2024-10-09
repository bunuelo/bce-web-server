<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { alert } from '$lib/bce_stores.js'
    import { user_session_is_valid } from '$lib/bce_stores.js'
    import { user_session_token } from '$lib/bce_stores.js'
    import { user_security_level } from '$lib/bce_stores.js'
    import { user_language } from '$lib/bce_stores.js'
    import { user_color_theme } from '$lib/bce_stores.js'
    import { bce_lang } from '$lib/bce_locale.js'
    import { zero_pad, format_date, format_time_since_date, format_json_datetime, format_time_since_json_datetime } from '$lib/bce_time.js'
    import { bce_canvas_render__draw_radial_eye } from '$lib/bce_canvas_render.js';
    import { stimrx } from '$lib/stimrx/stimrx.js';
    import BceSession from "$lib/bce_session.js";
    let bce_session = new BceSession();
    import AssetSelector from '$lib/AssetSelector.svelte'
    
    export let expression;
    
    let show_details = false;
    
    onMount(async () => {
        if (! $user_session_is_valid) {
            $user_session_is_valid = await bce_session.session_is_valid()
        }
        if (! $user_session_is_valid) {
            goto("/user/login");
        }
        $user_security_level = await bce_session.security_level()
        if ($user_security_level < 25) {
            goto("/user/dashboard");
        }
        await update_all();
    });

    async function update_all() {
    }

    async function on_click_hide_details() {
        show_details = false;
    }
    
    async function on_click_show_details() {
        show_details = true;
    }
    
</script>

<div>
    StimrxExpressionEditor
    {#if stimrx.stimrx_sequence_expression__is_type(expression)}
    <table>
        <tr>
	    <td>
	      <i>Sequence</i>
	    </td>
	</tr>
    </table>
    {:else if stimrx.stimrx_select_expression__is_type(expression)}
    <table>
        <tr>
	    <td>
	      <i>Select</i>
	    </td>
	</tr>
    </table>
    {:else}
    <table>
        <tr>
	    <td>
	      <i>Unknown StimrxExpression type</i>
	    </td>
	</tr>
    </table>
    {/if}
    <table>
        <tr>
            <td>
                {#if show_details}
                    <a href="#" on:click|preventDefault={on_click_hide_details}>
                        {bce_lang($user_language, "page_rxs_label_hide_details")}
                    </a>
            {:else}
                     <a href="#" on:click|preventDefault={on_click_show_details}>
                         {bce_lang($user_language, "page_rxs_label_show_details")}
                     </a>
                 {/if}
             </td>
         </tr>
         {#if show_details}
             <tr>
                 <td>
                     <textarea rows="20" cols="50" >
{JSON.stringify(expression, null, 4)}
                     </textarea>
                 </td>
             </tr>
         {/if}
     </table>
</div>
