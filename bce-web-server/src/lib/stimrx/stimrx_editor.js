import { stimrx } from '$lib/stimrx/stimrx.js';

// Editor BEGIN

function new_stimrx_editor() {
    let rx = stimrx.new_stimrx_sequence_expression([
        stimrx.new_stimrx_set_variable_expression(null, null, "left_eye_lens",  stimrx.new_stimrx_light_projection([])),
        stimrx.new_stimrx_set_variable_expression(null, null, "right_eye_lens", stimrx.new_stimrx_light_projection([])),
    ]);
    return {
	"type": "Editor",
	"rxs": [
	    rx
	]
    };
}

function stimrx_editor__is_type(expression) {
    return expression && typeof expression === "object" && expression.hasOwnProperty("type") && expression.type === "Editor";
}

// Editor END


export let stimrx_editor = {
    "new_stimrx_editor": new_stimrx_editor
};
