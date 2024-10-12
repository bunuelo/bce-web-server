
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
    return {
	"type": "SetVariableExpression",
	"location": location,
	"frame": frame,
	"name": name,
	"value": value
    };
}

function stimrx_set_variable_expression__is_type(expression) {
    return expression && typeof expression === "object" && expression.hasOwnProperty("type") && expression.type === "SetVariableExpression";
};

// SetVariableExpression END


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
    
    stimrx_right_eye_light_projection__initialize: stimrx_right_eye_light_projection__initialize,
    new_stimrx_right_eye_light_projection: new_stimrx_right_eye_light_projection,
    stimrx_right_eye_light_projection__is_type: stimrx_right_eye_light_projection__is_type,
};
