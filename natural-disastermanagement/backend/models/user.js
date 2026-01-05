const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:String,
    email:{ type:String, unique:true },
    mobile:Number,
    password:String,
    role:{ type:String, enum:['user','admin'], default:'user' },
    address:[
        {
            country:String,
            state:String,
            city:String,
            landmark:String,
            pincode:Number,
            house_no:String,
            address:String
        }
    ]
});

module.exports=mongoose.model('User',userSchema);