import { get } from 'svelte/store'
import { user_color_theme } from './bce_stores.js'
import BceSession from "$lib/bce_session.js";
let bce_session = new BceSession();

function bce_canvas_render__draw_radial_eye(canvas, ctx, color_theme) {
    var color_background;
    var color_axes;
    if (color_theme == "dark") {
        color_background = [0, 0, 0];
        color_axes       = [63, 63, 63];
    } else {
        color_background = [255, 255, 255];
        color_axes       = [191, 191, 191];
    }
    
    //console.log("update_eye: beginning.  eye_index = " + eye_index);
    
    ctx.canvas.width  = 0.25 * window.innerWidth;
    ctx.canvas.height = 0.25 * window.innerWidth;
    
    const center_x             = 0.5 * canvas.width;
    const center_y             = 0.5 * canvas.height;
    const maximum_alpha_radius = 0.5 * canvas.height - 1;
    
    const maximum_alpha = 45;
    const alpha_resolution = 5;
    
    // background
    ctx.fillStyle = "rgb(" + color_background[0] + "," + color_background[1] + "," + color_background[2] + ")";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // axes
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(" + color_axes[0] + "," + color_axes[1] + "," + color_axes[2] + ")";
    ctx.fillStyle   = "rgb(" + color_axes[0] + "," + color_axes[1] + "," + color_axes[2] + ")";
    ctx.beginPath();
    ctx.arc(center_x, center_y, 1, 0, 2 * Math.PI);
    ctx.fill();
    for (let alpha = alpha_resolution; alpha <= maximum_alpha; alpha += alpha_resolution) {
        ctx.beginPath();
        ctx.arc(center_x, center_y, maximum_alpha_radius * alpha / maximum_alpha, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

function bce_canvas_render__evaluation_eye_data(canvas, ctx, color_theme, evaluation, eye_index, draw_empty_responses=true) {
    var color_background;
    var color_axes;
    var color_can_see;
    var color_cannot_see;
    if (color_theme == "dark") {
        color_background = [0, 0, 0];
        color_axes       = [63, 63, 63];
        color_can_see    = [191, 191, 191];
        color_cannot_see = [31, 31, 31];
    } else {
        color_background = [255, 255, 255];
        color_axes       = [191, 191, 191];
        color_can_see    = [63, 63, 63];
        color_cannot_see = [223, 223, 223];
    }
    
    var eye_total_stimulus_count = 0;
    var eye_total_response_count = 0;
    
    //console.log("update_eye: beginning.  eye_index = " + eye_index);
    
    const center_x             = 0.5 * canvas.width;
    const center_y             = 0.5 * canvas.height;
    const maximum_alpha_radius = 0.5 * canvas.height - 1;
    
    const maximum_alpha = 45;
    const alpha_resolution = 5;
    
    // can/cannot see stimilus responses
    if (evaluation != null) {
        for (var response_i = 0; response_i < evaluation.responses.length; response_i ++) {
            const response = evaluation.responses[response_i];
            if (response.stimulus.eye == eye_index) {
                eye_total_stimulus_count ++;
                const response_alpha           = response.stimulus.direction.alpha * 180.0 / Math.PI;
                const response_omega           = response.stimulus.direction.omega * 180.0 / Math.PI;
                const response_radius          = 0.5 * response.stimulus.diameter * 180.0 / Math.PI;
                const response_radial_distance = maximum_alpha_radius * response_alpha / maximum_alpha;
                if (response.canSee == null) {
		    if (draw_empty_responses) {
			ctx.fillStyle   = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
			ctx.lineWidth = 1;
			ctx.strokeStyle = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
			ctx.beginPath();
			ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
				center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
				maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
			ctx.fill();
			ctx.stroke();
		    }
                } else {
                    eye_total_response_count ++;
                    //console.log("response_alpha = " + response_alpha + ", response_omega = " + response_omega + ", response_radius = " + response_radius);
                    if (response.canSee) {
                        ctx.fillStyle   = "rgb(" + color_can_see[0] + "," + color_can_see[1] + "," + color_can_see[2] + ")";
			ctx.lineWidth = 1;
                        ctx.strokeStyle = "rgb(" + color_can_see[0] + "," + color_can_see[1] + "," + color_can_see[2] + ")";
                        ctx.beginPath();
                        ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
                                center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
                                maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
			ctx.lineWidth = 1;
                        ctx.strokeStyle = "rgb(" + color_can_see[0] + "," + color_can_see[1] + "," + color_can_see[2] + ")";
                        ctx.beginPath();
                        ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
                                center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
                                maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    }
                }
            }
        }
    }
    
    return {
	"eye_total_stimulus_count": eye_total_stimulus_count,
	"eye_total_response_count": eye_total_response_count
    };
}

function bce_canvas_render__evaluation_eye(canvas, ctx, color_theme, evaluation, eye_index) {
    bce_canvas_render__draw_radial_eye(canvas, ctx, color_theme);
    return bce_canvas_render__evaluation_eye_data(canvas, ctx, color_theme, evaluation, eye_index);
}


function bce_canvas_render__alpha_omega_to_x_ratio(alpha, omega) {
    const center_x             = 0.5;
    const maximum_alpha_radius = 0.5 - 1;
    const maximum_alpha        = 45 * Math.PI / 180.0;
    return center_x + maximum_alpha_radius * alpha / maximum_alpha * Math.cos(omega);
}

function bce_canvas_render__alpha_omega_to_x(width, height, alpha, omega) {
    return bce_canvas_render__alpha_omega_to_x_ratio(alpha, omega) * width;
}

function bce_canvas_render__alpha_omega_to_y_ratio(alpha, omega) {
    const center_y             = 0.5;
    const maximum_alpha_radius = 0.5;
    const maximum_alpha        = 45 * Math.PI / 180.0;
    return center_y + maximum_alpha_radius * alpha / maximum_alpha * Math.sin(omega);
}

function bce_canvas_render__alpha_omega_to_y(width, height, alpha, omega) {
    return bce_canvas_render__alpha_omega_to_y_ratio(alpha, omega) * height;
}

function bce_canvas_render__blind_spot_canvas(ctx, total_left, total_top, total_width, total_height, color_theme, blind_spot) {
    var canvas = ctx.canvas;
    var min_x = null;
    var max_x = null;
    var min_y = null;
    var max_y = null;
    let border_size = 16;
    for (var i = 0; i < blind_spot.points.length; i ++) {
	let p = blind_spot.points[i];
	let x = bce_canvas_render__alpha_omega_to_x(total_width, total_height, p.alpha, p.omega);
	let y = bce_canvas_render__alpha_omega_to_y(total_width, total_height, p.alpha, p.omega);
	if (min_x === null || x - border_size < min_x) {
	    min_x = x - border_size;
	}
	if (min_y === null || y - border_size < min_y) {
	    min_y = y - border_size;
	}
	if (max_x === null || x + border_size > max_x) {
	    max_x = x + border_size;
	}
	if (max_y === null || y + border_size > max_y) {
	    max_y = y + border_size;
	}
    }
    let width  = Math.round(max_x - min_x + 1);
    let height = Math.round(max_y - min_y + 1);
    let left   = Math.floor(min_x);
    let top    = Math.floor(min_y);
    canvas.style.position = "absolute";
    canvas.style.left     = (total_left + left) + "px";
    canvas.style.top      = (total_top  + top)  + "px";
    canvas.style.width    = width;
    canvas.style.height   = height;
    //console.log("Setting blind spot canvas size to " + width + "x" + height + " at (" + left + ", " + top + ").");
    
    var color_grip;
    var color_blind_spot;
    if (color_theme == "dark") {
        color_grip = [255, 127, 0, 1.0];
        color_blind_spot = [127, 63, 0, 0.5];
    } else {
        color_grip = [255, 127, 0, 1.0];
        color_blind_spot = [127, 63, 0, 0.5];
    }
    let grip_radius = 1.0 * Math.PI / 180.0;
    const center_x             = 0.5 * total_width;
    const center_y             = 0.5 * total_height;
    const maximum_alpha_radius = 0.5 * total_height - 1;
    const maximum_alpha        = 45 * Math.PI / 180.0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.fillStyle = "rgba(" + color_blind_spot[0] + "," + color_blind_spot[1] + "," + color_blind_spot[2] + "," + color_blind_spot[3] + ")";
    ctx.strokeStyle = "rgba(" + color_blind_spot[0] + "," + color_blind_spot[1] + "," + color_blind_spot[2] + "," + color_blind_spot[3] + ")";
    ctx.beginPath();
    let start = blind_spot.points[1 % blind_spot.points.length];
    let start_x = bce_canvas_render__alpha_omega_to_x(total_width, total_height, start.alpha, start.omega);
    let start_y = bce_canvas_render__alpha_omega_to_y(total_width, total_height, start.alpha, start.omega);
    ctx.moveTo(start_x - left, start_y - top);
    for (var i = 0; i < blind_spot.points.length; i ++) {
	let p0 = blind_spot.points[i];
	let p1 = blind_spot.points[(i + 1) % blind_spot.points.length];
	let p2 = blind_spot.points[(i + 2) % blind_spot.points.length];
	let p3 = blind_spot.points[(i + 3) % blind_spot.points.length];
	
	let p0_x = bce_canvas_render__alpha_omega_to_x(total_width, total_height, p0.alpha, p0.omega);
	let p0_y = bce_canvas_render__alpha_omega_to_y(total_width, total_height, p0.alpha, p0.omega);
	let p1_x = bce_canvas_render__alpha_omega_to_x(total_width, total_height, p1.alpha, p1.omega);
	let p1_y = bce_canvas_render__alpha_omega_to_y(total_width, total_height, p1.alpha, p1.omega);
	let p2_x = bce_canvas_render__alpha_omega_to_x(total_width, total_height, p2.alpha, p2.omega);
	let p2_y = bce_canvas_render__alpha_omega_to_y(total_width, total_height, p2.alpha, p2.omega);
	let p3_x = bce_canvas_render__alpha_omega_to_x(total_width, total_height, p3.alpha, p3.omega);
	let p3_y = bce_canvas_render__alpha_omega_to_y(total_width, total_height, p3.alpha, p3.omega);
	
	let bc0_x = p1_x + 0.25 * (p2_x - p0_x) - left;
	let bc0_y = p1_y + 0.25 * (p2_y - p0_y) - top;
	let bc1_x = p2_x + 0.25 * (p1_x - p3_x) - left;
	let bc1_y = p2_y + 0.25 * (p1_y - p3_y) - top;
	let bc2_x = p2_x - left;
	let bc2_y = p2_y - top;
	//console.log("(" + bc0_x + "," + bc0_y + ") -- (" + bc1_x + "," + bc1_y + ") -- (" + bc2_x + "," + bc2_y + ")");
	ctx.bezierCurveTo(bc0_x, bc0_y,
			  bc1_x, bc1_y,
			  bc2_x, bc2_y);
    }
    //ctx.fill();
    ctx.stroke();
    for (var i = 0; i < blind_spot.points.length; i ++) {
	let point = blind_spot.points[i];
	let grip_alpha = point.alpha;
	let grip_omega = point.omega;
	
	//ctx.fillStyle = "rgba(" + color_grip[0] + "," + color_grip[1] + "," + color_grip[2] + "," + color_grip[3] + ")";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "rgba(" + color_grip[0] + "," + color_grip[1] + "," + color_grip[2] + "," + color_grip[3] + ")";
	ctx.beginPath();
	ctx.arc(bce_canvas_render__alpha_omega_to_x(total_width, total_height, grip_alpha, grip_omega) - left,
		bce_canvas_render__alpha_omega_to_y(total_width, total_height, grip_alpha, grip_omega) - top,
		maximum_alpha_radius * grip_radius / maximum_alpha, 0, 2 * Math.PI);
	//ctx.fill();
	ctx.stroke();
    }
}

export const bce_canvas_render = {
    bce_canvas_render__draw_radial_eye: bce_canvas_render__draw_radial_eye,
    bce_canvas_render__evaluation_eye_data: bce_canvas_render__evaluation_eye_data,
    bce_canvas_render__evaluation_eye: bce_canvas_render__evaluation_eye,
    bce_canvas_render__blind_spot: bce_canvas_render__blind_spot,
    bce_canvas_render__blind_spot_canvas: bce_canvas_render__blind_spot_canvas,
};
