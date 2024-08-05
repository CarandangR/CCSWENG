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
    subjectyear: {
        type: SchemaTypes.String,
        required: true
    },
    subjectterm: {
        type: SchemaTypes.String,
        required: true
    },
    subjectsection: {
        type: SchemaTypes.String,
        required: true
    },

});

const Subject = model('Subject', subjectSchema); 

export default course;
