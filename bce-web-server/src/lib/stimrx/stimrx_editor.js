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
	],
	"meta": {
	}
    };
}

function stimrx_editor__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "Editor";
}

function stimrx_editor__get_meta(_self, path) {
    let path_string = "" + path;
    if (! (path_string in _self.meta)) {
	_self._meta[path_string] = {};
    }
    return _self.meta[path_string];
}
				 
function stimrx_editor__get_meta_var(_self, path, name) {
    var meta = stimrx_editor__get_meta(_self, path);
    return meta[name];
}

function stimrx_editor__set_meta_var(_self, path, name, value) {
    var meta = stimrx_editor__get_meta(_self, path);
    meta[name] = value;
}

// Editor END


export let stimrx_editor = {
    "new_stimrx_editor": new_stimrx_editor,
    "stimrx_editor__is_type": stimrx_editor__is_type,
    "stimrx_editor__get_meta": stimrx_editor__get_meta,
    "stimrx_editor__get_meta_var": stimrx_editor__get_meta_var,
    "stimrx_editor__set_meta_var": stimrx_editor__set_meta_var,
};
