const User=require('../models/user');
const bcrypt=require('bcryptjs');
const { json } = require('express');
const jwt=require('jsonwebtoken');
exports.createUser=async(req,res)=>{
    try {
        // Check if user already exists
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser) {
            return res.status(400).json({message: 'User with this email already exists'});
        }

        const pass=await bcrypt.hash(req.body.password, 10);
        
        const user={
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile || null,
            password:pass,
            role: req.body.role === 'admin' ? 'admin' : 'user',
        };
        
        const address={
            country:req.body.country || '',
            state:req.body.state || '',
            city:req.body.city || '',
            landmark:req.body.landmark || '',
            pincode:req.body.pincode || null,
            house_no:req.body.house_no || '',
            address:req.body.address || '',
        }
        
        const createUser=await User.create(user);
        createUser.address.push(address);
        await createUser.save();
        
        // Generate JWT token
        const token=jwt.sign({id:createUser._id, role:createUser.role || 'user'}, process.env.JWT_SECRET || 'auth_key', {expiresIn:'10d'});
        
        res.status(201).json({
            message:'User created successfully',
            data: {
                user: createUser,
                token: token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({message: 'Registration failed', error: error.message});
    }
}

exports.login=async(req,res)=>{
    try {
        const user=await User.findOne({email:req.body.email});
        if(!user)
        {
            return res.status(401).json({message:"User not found"});
        }
        const match=await bcrypt.compare(req.body.password,user.password);
        if(match)
        {
            const token=jwt.sign({id:user._id, role:user.role || 'user'}, process.env.JWT_SECRET || 'auth_key', {expiresIn:'10d'});
            res.json({
                message:"Login successful",
                data: {
                    user: user,
                    token: token
                }
            });
        }
        else
        {
            res.status(401).json({message:"Invalid password"});
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Login failed', error: error.message});
    }
}

exports.profile=(req,res)=>{
   res.json({message:"profile fetched"});
}

// Admin quick-create endpoint (server-side guard should be added if exposed)
exports.createAdmin = async (req,res)=>{
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message:'name, email, password are required' });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message:'Admin already exists with this email' });
        const pass = await bcrypt.hash(password, 10);
        const admin = await User.create({ name, email, password: pass, role:'admin' });
        const token = jwt.sign({ id: admin._id, role:'admin' }, process.env.JWT_SECRET || 'auth_key', { expiresIn:'10d' });
        res.status(201).json({ message:'Admin created', data:{ user: admin, token } });
    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ message:'Failed to create admin', error: error.message });
    }
}