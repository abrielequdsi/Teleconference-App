const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidV4 } = require('uuid'); // Generate room ID
app.use(express.static('public')) 

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})


// Generate url room ID
app.get('/:room', (req,res) => {
    res.render('room', {roomId: req.params.room });
})



server.listen(3000)

