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
	"_meta": {
	}
    };
}

function stimrx_editor__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "Editor";
}

function stimrx_editor__get_meta(self, path) {
    let path_string = "" + path;
    if (! (path_string in self._meta)) {
	self._meta[path_string] = {};
    }
    return self._meta[path_string];
}
				 
function stimrx_editor__get_meta_var(self, path, name) {
    var _meta = stimrx_editor__get_meta(self, path);
    return _meta[name];
}

function stimrx_editor__set_meta_var(self, path, name, value) {
    var _meta = stimrx_editor__get_meta(self, path);
    _meta[name] = value;
}

// Editor END


export let stimrx_editor = {
    "new_stimrx_editor": new_stimrx_editor,
    "stimrx_editor__is_type": stimrx_editor__is_type,
    "stimrx_editor__get_meta": stimrx_editor__get_meta,
    "stimrx_editor__get_meta_var": stimrx_editor__get_meta_var,
    "stimrx_editor__set_meta_var": stimrx_editor__set_meta_var,
};
