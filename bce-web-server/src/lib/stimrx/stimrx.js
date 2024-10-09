
// SequenceExpression BEGIN

function new_stimrx_sequence_expression(children) {
    return {
	"type": "SequenceExpression",
	"children": children
    };
}

function stimrx_sequence_expression__is_type(expression) {
    return expression && "type" in expression && expression.type === "SequenceExpression";
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
    return expression && "type" in expression && expression.type === "SelectExpression";
};

// SelectExpression END


// GetVariableExpression BEGIN

function new_stimrx_get_variable_expression(location, frame, name) {
    return {
	"type": "GetVariableExpression",
	"location": location
	"frame": frame
	"name": name
    };
}

function stimrx_get_variable_expression__is_type(expression) {
    return expression && "type" in expression && expression.type === "GetVariableExpression";
};

// GetVariableExpression END


export const stimrx = {
    new_stimrx_sequence_expression: new_stimrx_sequence_expression,
    stimrx_sequence_expression__is_type: stimrx_sequence_expression__is_type,
    
    new_stimrx_select_expression: new_stimrx_select_expression,
    stimrx_select_expression__is_type: stimrx_select_expression__is_type,
    
    new_stimrx_get_variable_expression: new_stimrx_get_variable_expression,
    stimrx_get_variable_expression__is_type: stimrx_get_variable_expression__is_type,
};
