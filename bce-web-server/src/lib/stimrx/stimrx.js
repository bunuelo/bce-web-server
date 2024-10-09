
function new_stimrx_sequence_expression(children) {
    return {
	"type": "SequenceExpression",
	"children": children
    };
}

function stimrx_sequence_expression__is_type(expression) {
    return expression && "type" in expression && expression.type === "SequenceExpression";
};

function new_stimrx_select_expression(children) {
    return {
	"type": "SelectExpression",
	"children": children
    };
}

function stimrx_select_expression__is_type(expression) {
    return expression && "type" in expression && expression.type === "SelectExpression";
};

export const stimrx = {
    new_stimrx_sequence_expression: new_stimrx_sequence_expression,
    stimrx_sequence_expression__is_type: stimrx_sequence_expression__is_type,
    new_stimrx_select_expression: new_stimrx_select_expression,
    stimrx_select_expression__is_type: stimrx_select_expression__is_type,
};
