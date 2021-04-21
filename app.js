var express = require('express');

const axios = require('axios');
var HTMLParser = require('node-html-parser');

var app = express();
var port = 8080;
var ip = process.env.IP;
var routerUrl = "http://" + ip;
var password = process.env.PASSWORD;



app.get('/', function (req, res) {
   res.redirect('/index.html');
})

app.use(express.static('public'))

app.get('/api',async function(req, res, next){

  try {
    
    // get 1st token
    let response = await axios.get(routerUrl+'/login.php');
    var root = HTMLParser.parse(response.data);
    let tokenInput = root.querySelector('input[name="token"]');
    let tokenValue = tokenInput.getAttribute('value');
  
    // login to website
    const params = new URLSearchParams()
    params.append('token', tokenValue)
    params.append('password', password)

    const config = {
      headers: {
        'withCredentials': true,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }


    let login = await axios.post(routerUrl + '/login.php',params, config);
    let cookie = login.headers['set-cookie'];
    config.headers.Cookie = cookie;


    // load the info page to get the login token
    let info = await axios.get(routerUrl + '/info.php?sh=dev',config);
    var root2 = HTMLParser.parse(info.data);
    
    let js = root2.querySelectorAll('script[type="text/javascript"]');
    let token2Text = js[0].childNodes[0].rawText;

    let split = token2Text.split('var token=')[1];
    let token2Value = split.replace('\'','');
    token2Value = token2Value.replace('\'','');
    token2Value = token2Value.trim();

    
    // use the 2nd token to pull the json data
    const params2 = new URLSearchParams()
    params2.append('token', token2Value)
    params2.append('do', 'full')

    let thatGoodShit = await axios.post(routerUrl + '/info-async.php',params2, config);
    
    res.send(thatGoodShit.data);
  } catch (error) {
    return next(error);
  }
});




if(ip == null || ip == ""){
  console.log('IP env var was null or empty')
} else if (password == null || password == ""){
  console.error('PASSWORD env var was null or empty')
} else {
  var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 })
 
}
