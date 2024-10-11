import { stimrx } from '$lib/stimrx/stimrx.js';

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

export let stimrx_editor = {
    "new_stimrx_editor": new_stimrx_editor
};
