const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_STRING as any, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
