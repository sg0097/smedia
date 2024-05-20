

const app = require("./app");
const { connectDatabase } = require('./config/database');

connectDatabase();

// Middleware, routes, and other app configurations go here

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
