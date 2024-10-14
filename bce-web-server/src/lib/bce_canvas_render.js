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
                        ctx.strokeStyle = "rgb(" + color_can_see[0] + "," + color_can_see[1] + "," + color_can_see[2] + ")";
                        ctx.beginPath();
                        ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
                                center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
                                maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
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


function bce_canvas_render__blind_spot(canvas, ctx, color_theme, blind_spot) {
    var color_grip;
    if (color_theme == "dark") {
        color_grip = [255, 0, 0];
        //color_grip = [255, 255, 255];
    } else {
        color_grip = [255, 0, 0];
        //color_grip = [0, 0, 0];
    }
    for (var i = 0; i < blind_spot.points.length; i ++) {
	console.log("bce_canvas_render__blind_spot: rendering a point.");
	let point = blind_spot.points[i];
	
	let grip_radius = 0.5 * Math.PI / 180.0;
	let grip_alpha = point.alpha;
	let grip_omega = point.omega;
	
	const center_x             = 0.5 * canvas.width;
	const center_y             = 0.5 * canvas.height;
	const maximum_alpha_radius = 0.5 * canvas.height - 1;
	const maximum_alpha        = 45 * Math.PI / 180.0;
	
	//ctx.fillStyle = "rgb(" + color_grip[0] + "," + color_grip[1] + "," + color_grip[2] + ")";
	ctx.strokeStyle = "rgb(" + color_grip[0] + "," + color_grip[1] + "," + color_grip[2] + ")";
	ctx.beginPath();
	ctx.arc(center_x + grip_alpha * Math.cos(grip_omega),
		center_y + grip_alpha * Math.sin(grip_omega),
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
};
