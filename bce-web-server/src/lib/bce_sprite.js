
var sprite_canvas_storage = {};

function on_mousedown(event, canvas) {
    event.preventDefault();
    let x = event.pageX;
    let y = event.pageY;
    //console.log("Mouse down blind spot canvas.  (" + x + "," + y + ")");
    if (editor !== null) {
	if (editor.drag_canvas_id !== null) {
	    // clean up old drag?
	}
	bce_sprite.bring_sprite_to_front(canvas.canvas_id);
	editor.drag_canvas_id = canvas.canvas_id;
	canvas.drag_start_x = x;
	canvas.drag_start_y = y;
	canvas.drag_canvas_start_x = canvas.offsetLeft;
	canvas.drag_canvas_start_y = canvas.offsetTop;
    }
}

async function on_mouseup(event, canvas) {
    event.preventDefault();
    //if (editor !== null && editor.drag_canvas_id === canvas.canvas_id) {
    //	editor.drag_canvas_id = null;
    let x = event.pageX;
    let y = event.pageY;
    let move_x = x - canvas.drag_start_x;
    let move_y = y - canvas.drag_start_y;
    canvas.style.left = (canvas.drag_canvas_start_x + move_x) + "px";
    canvas.style.top  = (canvas.drag_canvas_start_y + move_y) + "px";
    //console.log("Mouse up blind spot canvas.  (" + move_x + "," + move_y + ")");
    canvas.drag = false;
    //for (var i = 0; i < canvas.blind_spot.points.length; i ++) {
    //    let point = canvas.blind_spot.points[i];
    //    let old_x = bce_canvas_render.bce_canvas_render__alpha_omega_to_x(canvas.light_projection_canvas.width, canvas.light_projection_canvas.height, point.alpha, point.omega);
    //    let old_y = bce_canvas_render.bce_canvas_render__alpha_omega_to_y(canvas.light_projection_canvas.width, canvas.light_projection_canvas.height, point.alpha, point.omega);
    //    let new_x = old_x + move_x;
    //    let new_y = old_y + move_y;
    //    let new_alpha = bce_canvas_render.bce_canvas_render__x_y_to_alpha(canvas.light_projection_canvas.width, canvas.light_projection_canvas.height, new_x, new_y)
    //    let new_omega = bce_canvas_render.bce_canvas_render__x_y_to_omega(canvas.light_projection_canvas.width, canvas.light_projection_canvas.height, new_x, new_y)
    //    point.alpha = new_alpha;
    //    point.omega = new_omega;
    //}
    //}
    //await changed_rx_editor_state();
}

function on_mousemove(event, canvas) {
    event.preventDefault();
    //if (editor !== null && editor.drag_canvas_id === canvas.canvas_id) {
    let x = event.pageX;
    let y = event.pageY;
    let move_x = x - canvas.drag_start_x;
    let move_y = y - canvas.drag_start_y;
    canvas.style.left = (canvas.drag_canvas_start_x + move_x) + "px";
    canvas.style.top  = (canvas.drag_canvas_start_y + move_y) + "px";
    //console.log("Mouse move blind spot canvas.  (" + move_x + "," + move_y + ")");
    //}
}

function get_sprite_canvas(canvas_id) {
    if (! (canvas_id in sprite_canvas_storage)) {
	let canvas = document.createElement("canvas");
	canvas.style.border = "1px solid blue";
	document.body.appendChild(canvas);
	canvas.canvas_id = canvas_id;
	canvas.drag_start_x            = null;
	canvas.drag_start_y            = null;
	canvas.drag_canvas_start_x     = null;
	canvas.drag_canvas_start_y     = null;
	canvas.addEventListener("mousedown",       function(event) {return       on_mousedown(event, canvas);}, false);
	canvas.addEventListener("mouseup",   async function(event) {return await on_mouseup(  event, canvas);}, false);
	canvas.addEventListener("mousemove",       function(event) {return       on_mousemove(event, canvas);}, false);
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
