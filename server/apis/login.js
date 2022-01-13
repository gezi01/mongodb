
const mongodb = require('../../mongodb/index.js');

module.exports = function(app){
  app.post('/index',async function (request,response) {
    response.send('post')
  })
  app.get('/index',function (req,res) {
      res.send('get')
  })

};