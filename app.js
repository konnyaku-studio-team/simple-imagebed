var express=require('express');
var fs = require("fs");
var crypto = require('crypto');
var bodyParser = require('body-parser');
var multer  = require('multer');
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('images'));
app.use('/images', express.static('images'));
const WEBSITE_TITLE="XX图床";
const VIEW_SITE="http://cxk.com.cn.uk.us/images/";
const CRYPT_KEY="sha512"
app.set("engine","ejs");
app.get('/',function(req,res){
    res.render("index.ejs",{
        images:"1",
        website_title:WEBSITE_TITLE
   });
})
app.post('/upload/images/', function (req, res) {
 
    // console.log(req.files[0]);  // 上传的文件信息
    // if(req.files[0].minetype.toString().test("image///g")){
    //     res.end("ERROR.");
    // }
    var real_file=req.files[0].originalname;
    // console.log(typeof req.files[0].originalname)
    var kzm='';
    for(var i=real_file.length-1;i>0;i--){
        if(real_file[i]==='.')break;
        kzm+=real_file[i];
        // console.log(i+":"+real_file[i]);
    }
    // console.log(kzm);
    kzm=kzm.split('').reverse().join('');
    // if(kzm===[])
    // console.log(kzm);
    var fname=crypto.createHash(CRYPT_KEY).update(real_file).digest('hex') + "." +kzm;
    var des_file = __dirname + "/images/" + fname;
    fs.readFile( req.files[0].path, function (err, data) {
         fs.writeFile(des_file, data, function (err) {
          if( err ){
               console.log( err );
          }else{
                res.render("upload_win.ejs",{
                    view_site:VIEW_SITE+fname,
                    website_title:WEBSITE_TITLE
                })
           }
        });
    });
 })
app.listen(2737);