export const CANVAS_TOP_SPACE = 50
export const CANVAS_LEFT_SPACE = 50
export const POLICY_COMPONENT_WIDTH = 150
export const POLICY_COMPONENT_HEIGHT = 50
export const POLICY_COMPONENT_COLOR = 'white'
export const INDETERMINATE_COLOR = 'yellow'
export const RULE_COMPONENT_WIDTH = 150
export const RULE_COMPONENT_HEIGHT = 50
export const RULE_COMPONENT_COLOR_INACTIVE = "white"
export const RULE_COMPONENT_COLOR_INAPPLICABLE = "grey"
export const RULE_COMPONENT_COLOR_PERMIT = "green"
export const RULE_COMPONENT_COLOR_DENY = "red"
export const COMPONENT_BORDER_COLOR_UNSELECTED = "grey"
export const COMPONENT_BORDER_COLOR_SELECTED = "black"
export const CHILD_COMPONENT_HORIZONTAL_INDENT = POLICY_COMPONENT_WIDTH
export const CHILD_COMPONENT_VERTICAL_SPACE = POLICY_COMPONENT_HEIGHT * 2
export const LINE_COLOR_INACTIVE = 'grey'
export const LINE_COLOR_ACTIVE = 'black'
export const LINE_COLOR_PERMIT = 'green'
export const LINE_COLOR_DENY = 'red'

export const DRAGGABLE_EVALUABLES = [
    {
        name: "Subject Has Attribute",
        type: "Evaluable",
        options: {op:"subjectHasAttribute"}
    },
    {
        name: "Resource Has Attribute",
        type: "Evaluable",
        options: {op: "resourceHasAttribute"}
    },
    {
        name: "Subject Attribute",
        type: "Evaluable",
        options: {op: "subjectAttribute"}
    },
    {
        name: "Resource Attribute",
        type: "Evaluable",
        options: {op: "resourceAttribute"}
    },
    {
        name: "Environment Attribute",
        type: "Evaluable",
        options: {op: "environmentAttribute"}
    },
    {
        name: "Value",
        type: "Evaluable",
        options: {op: "value"}
    },
    {
        name: "All Of",
        type: "Evaluable",
        options: {op: "combinator", comOp: "allOf"}
    },
    {
        name: "Any Of",
        type: "Evaluable",
        options: {op: "combinator", comOp: "anyOf"}
    },
    {
        name: "Equal To",
        type: "Evaluable",
        options: {op: "comparator", comOp: "equalTo"}
    },
    {
        name: "Less Than",
        type: "Evaluable",
        options: {op:"comparator", comOp: "lessThan"}
    },
    {
        name: "Greater Than",
        type: "Evaluable", 
        options: {op:"comparator", comOp: "greaterThan"}
    },
    {
        name: "Action Type",
        type: "Evaluable",
        options: {op: "actionType"}
    }
]

export const DRAGGABLE_ACTIONS = [
    {
        name: "Power Control",
        type: "Action",
        options: {type: "power_control"}
    },
    {
        name: "Config Data 1",
        type: "Action",
        options: {type: "config1"}
    },
    {
        name: "Config Data 2",
        type: "Action",
        options: {type: "config2"}
    }
]