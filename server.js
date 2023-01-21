import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const port = 4000

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})