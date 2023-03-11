import mongoose from 'mongoose'
const schema = new mongoose.Schema({
title:{
    type:String,
    required:['true','Please enter course title'],
    minLength:[4,'title must be at least 4 letters'],
    maxLength:[36,'kindly provide short title']
},
description:{
    type:String,
    required:true,
    minLength:['20','Explain more about the course']
},
lectures:[

{
        title:{
        type:String,
        required:true
        },
    description:{
        type:String,
        required:true
    },


    video:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }  
    }
},
],

poster:{
    public_id:{
            type:String,
            required:true
    },
    url:{
        type:String,
        required:true
    }
},

views:{
type:String,
default:0
},
numOfVideos:{
    type:Number,
    default:0
},
category:{
    type:String,
    required:true
},
createdBy:{
type:String,
required:[true,'Please specify course creator name']

},
createdAt:{
type:Date,
default:Date.now()
}
})


export const CourseModel = mongoose.model('Course',schema)