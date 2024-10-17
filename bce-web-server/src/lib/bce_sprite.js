
var sprite_canvas_storage = {};

function get_sprite_canvas(canvas_id) {
    if (! (canvas_id in sprite_canvas_storage)) {
	let canvas = document.createElement("canvas");
	canvas.style.border = "1px solid blue";
	document.body.appendChild(canvas);
	canvas.canvas_id = canvas_id;
	canvas.drag_start_x = null;
	canvas.drag_start_y = null;
	canvas.drag_canvas_start_x = null;
	canvas.drag_canvas_start_y = null;
	canvas.addEventListener("mousedown",       function(event) {return       on_mousedown_blind_spot_canvas(event, canvas);}, false);
	canvas.addEventListener("mouseup",   async function(event) {return await on_mouseup_blind_spot_canvas(event, canvas);}, false);
	canvas.addEventListener("mousemove",       function(event) {return       on_mousemove_blind_spot_canvas(event, canvas);}, false);
	sprite_canvas_storage[canvas_id] = canvas;
    }
    return sprite_canvas_storage[canvas_id];
}

function remove_all_sprites() {
    let canvas_ids = Object.keys(sprite_canvas_storage);
    for (var i = 0; i < canvas_ids.length; i ++) {
	let canvas_id = canvas_ids[i];
	let canvas    = sprite_canvas_storage[canvas_id];
	canvas.remove();
    }
    sprite_canvas_storage = {};
}

function bring_sprite_to_front(canvas_id) {
    if (! (canvas_id in sprite_canvas_storage)) {
	console.log("bring_sprite_to_front ERROR: blind spot canvas does not exist.");
    }
    let canvas = sprite_canvas_storage[canvas_id];
    canvas.remove();
    document.body.appendChild(canvas);
}

export let bce_sprite = {
    get_sprite_canvas: get_sprite_canvas,
    remove_all_sprites: remove_all_sprites,
    bring_sprite_to_front: bring_sprite_to_front,
};
