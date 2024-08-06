import { SchemaTypes, Schema, model } from 'mongoose'; 

const subjectSchema = new Schema({
    college: {
        type: SchemaTypes.String,
        required: true
    },
    subjectname: {
        type: SchemaTypes.String,
        required: true
    },
    subjectabb: {
        type: SchemaTypes.String,
        required: true
    },
    subjecttakers: {
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
    subjectsection: {
        type: SchemaTypes.String,
        required: true
    },

});

const Subject = model('Subject', subjectSchema); 

export default Subject;
