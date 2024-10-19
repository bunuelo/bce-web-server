
// SequenceExpression BEGIN

function new_stimrx_sequence_expression(children) {
    return {
	"type": "SequenceExpression",
	"children": children
    };
}

function stimrx_sequence_expression__is_type(expression) {
    return expression && typeof expression === "object" && expression.hasOwnProperty("type") && expression.type === "SequenceExpression";
};

// SequenceExpression END


// SelectExpression BEGIN

function new_stimrx_select_expression(children) {
    return {
	"type": "SelectExpression",
	"children": children
    };
}

function stimrx_select_expression__is_type(expression) {
    return expression && typeof expression === "object" && expression.hasOwnProperty("type") && expression.type === "SelectExpression";
};

// SelectExpression END


// GetVariableExpression BEGIN

function new_stimrx_get_variable_expression(location, frame, name) {
    return {
	"type": "GetVariableExpression",
	"location": location,
	"frame": frame,
	"name": name
    };
}

function stimrx_get_variable_expression__is_type(expression) {
    return expression && typeof expression === "object" && expression.hasOwnProperty("type") && expression.type === "GetVariableExpression";
};

// GetVariableExpression END


// SetVariableExpression BEGIN

function new_stimrx_set_variable_expression(location, frame, name, value) {
    var self = {};
    self["type"] = "SetVariableExpression";
    self["name"] = name;
    self["value"] = value;
    if (location !== null) {
	self["location"] = location;
    }
    if (frame !== null) {
	self["frame"] = frame;
    }
    return self;
}

function stimrx_set_variable_expression__is_type(expression) {
    return expression && typeof expression === "object" && expression.hasOwnProperty("type") && expression.type === "SetVariableExpression";
};

// SetVariableExpression END


// Evaluation BEGIN

//function new_stimrx_evaluation(alpha, omega) {
//    return {
//	"type": "Evaluation",
//    };
//}

function stimrx_evaluation__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "Evaluation";
};

// Evaluation END


// LightAngle BEGIN

function new_stimrx_light_angle(alpha, omega) {
    return {
	"type": "LightAngle",
	"alpha": alpha,
	"omega": omega
    };
}

function stimrx_light_angle__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "LightAngle";
};

// LightAngle END


// LightTriangle BEGIN

function new_stimrx_light_triangle(a, b, c) {
    return {
	"type": "LightTriangle",
	"a": a,
	"b": b,
	"c": c
    };
}

function stimrx_light_triangle__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "LightTriangle";
};

// LightTriangle END


// LightTriangleProjection BEGIN

function new_stimrx_light_triangle_projection(from, to) {
    return {
	"type": "LightTriangleProjection",
	"from": from,
	"to": to
    };
}

function stimrx_light_triangle_projection__is_type(x) {
    return x && typeof x === "object" && x.hasOwnProperty("type") && x.type === "LightTriangleProjection";
};

// LightTriangleProjection END


// LightProjection BEGIN

function stimrx_light_projection__initialize(self, type, triangles) {
    self["type"]      = type;
    self["triangles"] = triangles;
}

function new_stimrx_light_projection(triangles) {
    var self = {};
    stimrx_light_projection__initialize(self, "LightProjection", triangles);
    return self;
}

function stimrx_light_projection__is_type(x) {
    return (x && typeof x === "object" && "type" in x && x.type === "LightProjection") ||
	stimrx_left_eye_light_projection__is_type(x) ||
	stimrx_right_eye_light_projection__is_type(x);
};

// LightProjection END


function new_default_light_projection_triangles() {
    var triangles = [];
    let maximum_alpha = 45.0 * Math.PI / 180.0;
    let resolution    = 2.5 * Math.PI / 180.0;
    let alpha_count   = Math.round(maximum_alpha / resolution);
    for (var i = 0; i < alpha_count; i ++) {
	let a0                  = i * resolution;
	let a1                  = (i + 1) * resolution;
	let a0_circumference    = 2.0 * Math.PI * a0;
	var a0_omega_count      = Math.round(a0_circumference / resolution);
	if (a0_omega_count < 1) {
	    a0_omega_count = 1;
	}
	let a1_circumference    = 2.0 * Math.PI * a1;
	let a1_omega_count      = Math.round(a1_circumference / resolution);
	for (var j1 = 0; j1 < a1_omega_count; j1 ++) {
	    let j1_next = (j1 + 1) % a1_omega_count;
	    let j0      = Math.floor(j1      * a0_omega_count / a1_omega_count);
	    let j0_next = Math.floor(j1_next * a0_omega_count / a1_omega_count);
	    if (j0 == j0_next) {
		// draw triangle
		let a0_o                = j0      * 2.0 * Math.PI / a0_omega_count;
		let a1_o0               = j1      * 2.0 * Math.PI / a1_omega_count;
		let a1_o1               = j1_next * 2.0 * Math.PI / a1_omega_count;
		let from_triangle       = new_stimrx_light_triangle(new_stimrx_light_angle(a0, a0_o),
								    new_stimrx_light_angle(a1, a1_o0),
								    new_stimrx_light_angle(a1, a1_o1));
		let to_triangle         = new_stimrx_light_triangle(new_stimrx_light_angle(a0, a0_o),
								    new_stimrx_light_angle(a1, a1_o0),
								    new_stimrx_light_angle(a1, a1_o1));
		let triangle_projection = new_stimrx_light_triangle_projection(from_triangle, to_triangle);
		triangles.push(triangle_projection);
	    } else {
		// draw quadrilateral
		let a0_o0 = j0      * 2.0 * Math.PI / a0_omega_count;
		let a0_o1 = j0_next * 2.0 * Math.PI / a0_omega_count;
		let a1_o0 = j1      * 2.0 * Math.PI / a1_omega_count;
		let a1_o1 = j1_next * 2.0 * Math.PI / a1_omega_count;
		let from_triangle_0       = new_stimrx_light_triangle(new_stimrx_light_angle(a0, a0_o0),
								      new_stimrx_light_angle(a1, a1_o0),
								      new_stimrx_light_angle(a1, a1_o1));
		let to_triangle_0         = new_stimrx_light_triangle(new_stimrx_light_angle(a0, a0_o0),
								      new_stimrx_light_angle(a1, a1_o0),
								      new_stimrx_light_angle(a1, a1_o1));
		let triangle_projection_0 = new_stimrx_light_triangle_projection(from_triangle_0, to_triangle_0);
		triangles.push(triangle_projection_0);
		let from_triangle_1       = new_stimrx_light_triangle(new_stimrx_light_angle(a0, a0_o0),
								      new_stimrx_light_angle(a1, a1_o1),
								      new_stimrx_light_angle(a0, a0_o1));
		let to_triangle_1         = new_stimrx_light_triangle(new_stimrx_light_angle(a0, a0_o0),
								      new_stimrx_light_angle(a1, a1_o1),
								      new_stimrx_light_angle(a0, a0_o1));
		let triangle_projection_1 = new_stimrx_light_triangle_projection(from_triangle_1, to_triangle_1);
		triangles.push(triangle_projection_1);
	    }
	}
    }
    return triangles;
}


// LeftEyeLightProjection BEGIN

function stimrx_left_eye_light_projection__initialize(self, type, triangles) {
    stimrx_light_projection__initialize(self, type, triangles);
}

function new_stimrx_left_eye_light_projection(triangles) {
    var self = {};
    stimrx_left_eye_light_projection__initialize(self, "LeftEyeLightProjection", triangles);
    return self;
}

function stimrx_left_eye_light_projection__is_type(x) {
    return x && typeof x === "object" && "type" in x && x.type === "LeftEyeLightProjection";
};

function new_default_stimrx_left_eye_light_projection() {
    let triangles = new_default_light_projection_triangles();
    return new_stimrx_left_eye_light_projection(triangles);
}

// LeftEyeLightProjection END


// RightEyeLightProjection BEGIN

function stimrx_right_eye_light_projection__initialize(self, type, triangles) {
    stimrx_light_projection__initialize(self, type, triangles);
}

function new_stimrx_right_eye_light_projection(triangles) {
    var self = {};
    stimrx_right_eye_light_projection__initialize(self, "RightEyeLightProjection", triangles);
    return self;
}

function stimrx_right_eye_light_projection__is_type(x) {
    return x && typeof x === "object" && "type" in x && x.type === "RightEyeLightProjection";
};

function new_default_stimrx_right_eye_light_projection() {
    let triangles = new_default_light_projection_triangles();
    return new_stimrx_right_eye_light_projection(triangles);
}

// RightEyeLightProjection END





export const stimrx = {
    new_stimrx_sequence_expression: new_stimrx_sequence_expression,
    stimrx_sequence_expression__is_type: stimrx_sequence_expression__is_type,
    
    new_stimrx_select_expression: new_stimrx_select_expression,
    stimrx_select_expression__is_type: stimrx_select_expression__is_type,
    
    new_stimrx_get_variable_expression: new_stimrx_get_variable_expression,
    stimrx_get_variable_expression__is_type: stimrx_get_variable_expression__is_type,
    
    new_stimrx_set_variable_expression: new_stimrx_set_variable_expression,
    stimrx_set_variable_expression__is_type: stimrx_set_variable_expression__is_type,
    
    stimrx_evaluation__is_type: stimrx_evaluation__is_type,

    new_stimrx_light_angle: new_stimrx_light_angle,
    stimrx_light_angle__is_type: stimrx_light_angle__is_type,
    
    new_stimrx_light_triangle: new_stimrx_light_triangle,
    stimrx_light_triangle__is_type: stimrx_light_triangle__is_type,
    
    new_stimrx_light_triangle_projection: new_stimrx_light_triangle_projection,
    stimrx_light_triangle_projection__is_type: stimrx_light_triangle_projection__is_type,
    
    new_stimrx_light_projection: new_stimrx_light_projection,
    stimrx_light_projection__is_type: stimrx_light_projection__is_type,

    stimrx_left_eye_light_projection__initialize: stimrx_left_eye_light_projection__initialize,
    new_stimrx_left_eye_light_projection: new_stimrx_left_eye_light_projection,
    stimrx_left_eye_light_projection__is_type: stimrx_left_eye_light_projection__is_type,
    new_default_stimrx_left_eye_light_projection: new_default_stimrx_left_eye_light_projection,
    
    stimrx_right_eye_light_projection__initialize: stimrx_right_eye_light_projection__initialize,
    new_stimrx_right_eye_light_projection: new_stimrx_right_eye_light_projection,
    stimrx_right_eye_light_projection__is_type: stimrx_right_eye_light_projection__is_type,
    new_default_stimrx_right_eye_light_projection: new_default_stimrx_right_eye_light_projection,
};
