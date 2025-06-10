const mongoose = require('mongoose');

const uri = 'mongodb+srv://vishal6021:Vishal@6021@cluster0.uduocps.mongodb.net/Project0?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB!'))
.catch(err => console.error('❌ Connection error:', err.message));
