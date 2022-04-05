const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const app = express();
app.use(bodyParser.json());
app.use(cors());
// API
app.use(express.static(path.join(__dirname, './client/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build'))
})
app.get("/fetch",(req,res)=>{
  res.send("new")
})
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    });
