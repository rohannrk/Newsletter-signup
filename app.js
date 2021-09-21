const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require("inspector");
const { post } = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html")
 });

app.post("/", function(req,res){
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us5.api.mailchimp.com/3.0/lists/705ab63ee8"
    const options ={
        method: "POST",
        auth: "rohan:d383f1449481ef4314e0d2845e813012-us5"
    }
    const request = https.request(url, options, function(response){

        if (response.statusCode===200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

         response.on("data", function(data){
             console.log(JSON.parse(data));
         })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/")
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running at port 3000");
});

// Api Key
// d383f1449481ef4314e0d2845e813012-us5
// list Id
// 705ab63ee8