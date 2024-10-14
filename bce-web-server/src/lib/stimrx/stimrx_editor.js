import { stimrx } from '$lib/stimrx/stimrx.js';

// Editor BEGIN

function new_stimrx_editor() {
    let rx = stimrx.new_stimrx_sequence_expression([
        stimrx.new_stimrx_set_variable_expression(null, null, "left_eye_lens",  stimrx.new_stimrx_left_eye_light_projection([])),
        stimrx.new_stimrx_set_variable_expression(null, null, "right_eye_lens", stimrx.new_stimrx_right_eye_light_projection([])),
    ]);
    return {
	"type": "Editor",
	"rxs": [
	    rx
	],
	"meta": {
	},
	"evaluations": [
	],
	"left_eye_blind_spots": [],
	"right_eye_blind_spots": [],
    };
}

function stimrx_editor__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "Editor";
}

function stimrx_editor__get_meta(_self, path) {
    let path_string = "" + path;
    if (! (path_string in _self.meta)) {
	_self.meta[path_string] = {};
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


// EditorEvaluation BEGIN

function new_stimrx_editor_evaluation(asset_name) {
    return {
	"type": "EditorEvaluation",
	"asset_name": asset_name,
	"enable_left_eye_overlay": true,
	"enable_right_eye_overlay": true,
    };
}

function stimrx_editor_evaluation__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "EditorEvaluation";
}

// EditorEvaluation END


// EditorBlindSpot BEGIN

function new_stimrx_editor_blind_spot(points) {
    return {
	"type": "EditorBlindSpot",
	"points": points,
    };
}

function stimrx_editor_blind_spot__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "EditorBlindSpot";
}

function new_defauilt_left_eye_stimrx_editor_blind_spot() {
    var points = [];
    return stimrx_editor.new_stimrx_editor_blind_spot(points);
}

function new_defauilt_right_eye_stimrx_editor_blind_spot() {
    var points = [];
    return stimrx_editor.new_stimrx_editor_blind_spot(points);
}



// EditorBlindSpot END


export let stimrx_editor = {
    new_stimrx_editor: new_stimrx_editor,
    stimrx_editor__is_type: stimrx_editor__is_type,
    stimrx_editor__get_meta: stimrx_editor__get_meta,
    stimrx_editor__get_meta_var: stimrx_editor__get_meta_var,
    stimrx_editor__set_meta_var: stimrx_editor__set_meta_var,
    
    new_stimrx_editor_evaluation: new_stimrx_editor_evaluation,
    stimrx_editor_evaluation__is_type: stimrx_editor_evaluation__is_type,
    
    new_stimrx_editor_blind_spot: new_stimrx_editor_blind_spot,
    stimrx_editor_blind_spot__is_type: stimrx_editor_blind_spot__is_type,
    new_defauilt_left_eye_stimrx_editor_blind_spot: new_defauilt_left_eye_stimrx_editor_blind_spot,
    new_defauilt_right_eye_stimrx_editor_blind_spot: new_defauilt_right_eye_stimrx_editor_blind_spot,
    
};
