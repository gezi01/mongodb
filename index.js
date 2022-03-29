const express = require('express')
const app = express()
const port = 8888

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

app.all("*", function(req,res,next){
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin",'*');
  //允许的header类型
  res.header("Access-Control-Allow-Headers","Content-Type,Content-Length,Authorization,Accept,X-Requested-With");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
  res.header("Content-Type","application/json;chaarset=utf-8");
  next();
});

require("./server/apis/index")(app);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
