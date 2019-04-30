const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_STRING, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    console.log('Connected to MongoDB');
});

export default db;
