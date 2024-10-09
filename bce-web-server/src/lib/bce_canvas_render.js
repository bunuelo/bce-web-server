import { get } from 'svelte/store'
import { user_color_theme } from './bce_stores.js'


function bce_canvas_render__evaluation_eye(canvas, ctx, evaluation, eye_index) {
    const color_theme = get(user_color_theme);
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
    
    var eye_total_stimulus_count = [0, 0];
    var eye_total_response_count = [0, 0];
    
    //console.log("update_eye: beginning.  eye_index = " + eye_index);
    
    ctx.canvas.width  = 0.25 * window.innerWidth;
    ctx.canvas.height = 0.25 * window.innerWidth;
    
    eye_total_stimulus_count[eye_index] = 0;
    eye_total_response_count[eye_index] = 0;
    
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
    
    // can/cannot see stimilus responses
    if (evaluation != null) {
        for (var response_i = 0; response_i < evaluation.responses.length; response_i ++) {
            const response = evaluation.responses[response_i];
            if (response.stimulus.eye == eye_index) {
                eye_total_stimulus_count[eye_index] ++;
                const response_alpha           = response.stimulus.direction.alpha * 180.0 / Math.PI;
                const response_omega           = response.stimulus.direction.omega * 180.0 / Math.PI;
                const response_radius          = 0.5 * response.stimulus.diameter * 180.0 / Math.PI;
                const response_radial_distance = maximum_alpha_radius * response_alpha / maximum_alpha;
                if (response.canSee == null) {
                    ctx.fillStyle   = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
                    ctx.strokeStyle = "rgb(" + color_cannot_see[0] + "," + color_cannot_see[1] + "," + color_cannot_see[2] + ")";
                    ctx.beginPath();
                    ctx.arc(center_x + response_radial_distance * Math.cos(response.stimulus.direction.omega),
                            center_y + response_radial_distance * Math.sin(response.stimulus.direction.omega),
                            maximum_alpha_radius * response_radius / maximum_alpha, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                } else {
                    eye_total_response_count[eye_index] ++;
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

