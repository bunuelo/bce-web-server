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
    import StimrxExpressionEditor from '$lib/stimrx/StimrxExpressionEditor.svelte'
    
    export let expression;
    
    let view_selected;
    
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
    
    async function on_click_hide_more_details() {
        show_more_details = false;
    }
    
    async function on_click_show_more_details() {
        show_more_details = true;
    }
    
</script>

<style>
    div.stimrxExpression {
	float: left;
        background-color: var(--surface1);
        border: 2px solid var(--element2);
    }
</style>

<div class="stimrxExpression">
    {#if stimrx.stimrx_sequence_expression__is_type(expression)}
    <i>Sequence</i>
    <select bind:value={view_selected}>
        <option value="expand">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	</option>
        <option value="minimal">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	</option>
        <option value="code">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	</option>
    </select>
    {#if view_selected === "expand"}
        <table>
            <tr>
	        <td width="50px">
	        </td>
                {#each expression.children as child}
	            <td>
	                <StimrxExpressionEditor bind:expression={child}/>
	            </td>
    	        {/each}
	    </tr>
        </table>
    {/if}
    {:else if stimrx.stimrx_select_expression__is_type(expression)}
    <i>Select</i>
    <select bind:value={view_selected}>
        <option value="expand">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	</option>
        <option value="minimal">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	</option>
        <option value="code">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	</option>
    </select>
    {#if view_selected === "expand"}
        <table>
            <tr>
	        <td width="50px">
	        </td>
	        <td>
	        </td>
	    </tr>
            {#each expression.children as child}
                <tr>
	            <td>
	            </td>
	            <td>
	                <StimrxExpressionEditor bind:expression={child}/>
	            </td>
	        </tr>
	    {/each}
        </table>
    {/if}
    {:else if stimrx.stimrx_get_variable_expression__is_type(expression)}
    <i>Get Variable</i>
    <select bind:value={view_selected}>
        <option value="minimal">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	</option>
        <option value="code">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	</option>
    </select>
    <table>
        <tr>
	    <td width="50px">
	    </td>
	    <td>
	    </td>
	</tr>
        <tr>
	    <td>
	    </td>
	    <td>
	        <tt>{expression.name}</tt>
	    </td>
	</tr>
    </table>
    {:else if stimrx.stimrx_set_variable_expression__is_type(expression)}
    <i>Set Variable</i>
    <select bind:value={view_selected}>
        <option value="expand">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_expand")}
	</option>
        <option value="minimal">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	</option>
        <option value="code">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	</option>
    </select>
    <table>
        <tr>
	    <td width="50px">
	    </td>
	    <td>
	    </td>
	</tr>
        <tr>
	    <td>
	    </td>
	    <td>
	        <tt>{expression.name}&nbsp;=</tt>
	    </td>
	    {#if view_selected === "expand"}
	        <td>
	            <StimrxExpressionEditor bind:expression={expression.value}/>
	        </td>
	    {/if}
	</tr>
    </table>
    {:else if Number.isFinite(expression)}
    <i>Number</i>
    <select bind:value={view_selected}>
        <option value="minimal">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	</option>
        <option value="code">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	</option>
    </select>
    <table>
        <tr>
	    <td width="50px">
	    </td>
	    <td>
	    </td>
	</tr>
        <tr>
	    <td>
	    </td>
	    <td>
	        <tt>{expression}</tt>
	    </td>
	</tr>
    </table>
    {:else}
    <select bind:value={view_selected}>
        <option value="minimal">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_minimal")}
	</option>
        <option value="code">
	    {bce_lang($user_language, "component_stimrx_expression_editor_label_code")}
	</option>
    </select>
    <table>
        <tr>
	    <td>
	      <i>Unknown StimrxExpression type</i>
	    </td>
	</tr>
    </table>
    {/if}
    {#if view_selected === "code"}
        <textarea rows="20" cols="50" >
{JSON.stringify(expression, null, 4)}
        </textarea>
    {/if}
</div>
