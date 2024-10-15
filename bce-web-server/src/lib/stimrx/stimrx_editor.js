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
	"canvas_index": 0,
    };
}

function stimrx_editor_evaluation__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "EditorEvaluation";
}

// EditorEvaluation END


// EditorBlindSpot BEGIN

function new_stimrx_editor_blind_spot(editor, points) {
    let canvas_id = "canvas_id_" + editor.canvas_index;
    editor.canvas_index ++;
    return {
	"type": "EditorBlindSpot",
	"points": points,
	"enable": true,
	"canvas_id": canvas_id,
    };
}

function stimrx_editor_blind_spot__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "EditorBlindSpot";
}

function new_stimrx_light_angle_from_horizontal_and_vertical_angles(horizontal_angle, vertical_angle) {
    let alpha = Math.sqrt(horizontal_angle * horizontal_angle + vertical_angle * vertical_angle);
    let omega = Math.atan2(-vertical_angle, horizontal_angle);
    console.log("alpha = " + alpha + ", omega = " + omega);
    return stimrx.new_stimrx_light_angle(alpha, omega);
}

function new_default_left_eye_stimrx_editor_blind_spot(editor) {
    var points = [];
    let center_horizontal_angle  = -0.5 * (12.0 + 15.0) * Math.PI / 180.0;
    let center_vertical_angle = -1.5 * Math.PI / 180.0;
    let height = 7.5 * Math.PI / 180.0;
    let width  = 5.5 * Math.PI / 180.0;
    let polygon_side_count = 5;
    for (var i = 0; i < polygon_side_count; i ++) {
	let spot_subangle    = (i * 2.0 * Math.PI / polygon_side_count) + 0.5 * Math.PI;
	let horizontal_angle = center_horizontal_angle + Math.cos(spot_subangle) * 0.5 * width;
	let vertical_angle   = center_vertical_angle   + Math.sin(spot_subangle) * 0.5 * height;
	let point            = new_stimrx_light_angle_from_horizontal_and_vertical_angles(horizontal_angle, vertical_angle);
	points.push(point);
    }
    return stimrx_editor.new_stimrx_editor_blind_spot(editor, points);
}

function new_default_right_eye_stimrx_editor_blind_spot(editor) {
    var points = [];
    let center_horizontal_angle  = 0.5 * (12.0 + 15.0) * Math.PI / 180.0;
    let center_vertical_angle = -1.5 * Math.PI / 180.0;
    let height = 7.5 * Math.PI / 180.0;
    let width  = 5.5 * Math.PI / 180.0;
    let polygon_side_count = 5;
    for (var i = 0; i < polygon_side_count; i ++) {
	let spot_subangle    = (i * 2.0 * Math.PI / polygon_side_count) + 0.5 * Math.PI;
	let horizontal_angle = center_horizontal_angle + Math.cos(spot_subangle) * 0.5 * width;
	let vertical_angle   = center_vertical_angle   + Math.sin(spot_subangle) * 0.5 * height;
	let point            = new_stimrx_light_angle_from_horizontal_and_vertical_angles(horizontal_angle, vertical_angle);
	points.push(point);
    }
    return stimrx_editor.new_stimrx_editor_blind_spot(editor, points);
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
    new_default_left_eye_stimrx_editor_blind_spot: new_default_left_eye_stimrx_editor_blind_spot,
    new_default_right_eye_stimrx_editor_blind_spot: new_default_right_eye_stimrx_editor_blind_spot,
    
};
