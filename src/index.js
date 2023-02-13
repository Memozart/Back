const app = require('./app');
const config = require('./config');
const port = config.port || 3000;

app.listen(port, () => console.log(`The server is running on port ${port}`));
