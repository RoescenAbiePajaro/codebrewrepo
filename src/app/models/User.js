import {Schema} from 'mongoose';

const UsernameSchema = new Schema({
    email: {type: String,required: true, unique:true},
    password: {
        type:String,
        required:true,
        validate: pass => {
            if (!pass?.length || pass.length < 5)
        },
    },

});