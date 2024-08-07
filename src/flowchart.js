import { SchemaTypes, Schema, model } from 'mongoose'; 

const flowchartSchema = new Schema({
    collegecourse: {
        type: SchemaTypes.String,
        required: true
    },
    subjectabb: {
        type: SchemaTypes.String,
        required: true
    },
    subjectunits: {
        type: SchemaTypes.Number,
        required: true
    },
    subjectyear: {
        type: SchemaTypes.Number,
        required: true
    },
    subjectterm: {
        type: SchemaTypes.Number,
        required: true
    },
});

const courseFlowchart = model('courseFlowchart', flowchartSchema); 

export default courseFlowchart;