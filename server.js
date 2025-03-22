const express = require('express');
const routes = require('./src/routes');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const { mongoUri } = require('./config/config');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
