//===============
//Modules Import
//===============
const sgMail = require('@sendgrid/mail');
const funcHelper = require('../funcHelper');
const https = require('https');

//url format: /[api-module]/[api-name]/[params]
//example: /mail/send/

function apiMail(response, request) {
    console.log("---===###| api MAIL module fired! |###===---");
    var reqURL = decodeURIComponent(request.url).toLowerCase();
    var apiModule = "/mail";
    var apiParams = "";
    if ((reqURL.match(/\//g) || []).length > 3
        || ((reqURL.match(/\//g) || []).length === 3 && reqURL.slice(-1) !== "/")
    ){
        var thirdSlashCharPos = funcHelper.indexOfNth(reqURL, "/", 3);
        apiParams = reqURL.substring(thirdSlashCharPos, reqURL.length);
    }
    var apiName = reqURL.replace(apiModule, "").replace(apiParams, "").replace(/\//g, '');

    console.log("~==> api module name: ", apiName);
    if (apiParams !== ""){
        console.log("~==> api params: ", apiParams)
    }

    switch (apiName) {
        
        case "send":
            console.log("~==> Executing module...")

            if (request.method === "POST") {

                var accumulatedData = "";
                var post = "";
                request.on('data', function (chunk) {
                    accumulatedData += chunk;
                });

                request.on('end', function () {

                    post = JSON.parse(accumulatedData);
                    
                    validateRecaptcha(post.recaptchaToken)
                    .then((data) => {
                        console.log("data", data)
                        if(data.success === true){
                            sendMail(
                                post.mailTo,
                                post.mailFrom,
                                post.mailSubject,
                                post.mailText + "<br/><br/>" +
                                "------------------<br/>" +
                                "Message sent by: " + post.messageFromName + " (" + post.messageFromEmail + ") ",
                                function () {
                                    //completed
                                    var retObj = {
                                        status: "success"
                                    }
                                    response.writeHead(200, { "Content-Type": "application/json" });
                                    response.end(JSON.stringify(retObj));
                                },
                                function (error) {
                                    //error
                                    var retObj = {
                                        status: "error",
                                        error_msg: error
                                    }
                                    response.writeHead(200, { "Content-Type": "application/json" });
                                    response.end(JSON.stringify(retObj));
                                }
                            );
                        }
                        else{
                            let error = "Failed reCaptcha verification!";
                            var retObj = {
                                status: "error",
                                error_msg: error
                            }
                            response.writeHead(200, { "Content-Type": "application/json" });
                            response.end(JSON.stringify(retObj));
                        }
                    })
                    .catch((err) => {
                        var retObj = {
                            status: "error",
                            error_msg: err
                        }
                        response.writeHead(400, { "Content-Type": "application/json" });
                        response.end(JSON.stringify(retObj));
                    })
                });
            }
            else {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.write("The resource you have requested is not available.");
                response.end();
            }

            console.log("~==> Execution Completed!")
            break;
        
        default:
            console.log("~==> Module not found!")

            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.write("The resource you have requested is not available.");
            response.end();
            break;
    }
    // response.writeHead(200, { 'Content-Type': 'text/html' });
    // response.end();
}

function sendMail(sendTo, sendFrom, sendSubject, sendHtml, onComplete, onError) {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    // For development, replace process.env.SENDGRID_API_KEY with actual key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const mailObj = {
        to: sendTo, //
        from: sendFrom,
        subject: sendSubject,
        // text: sendText,
        html: sendHtml,
    }
    sgMail
        .send(mailObj)
        .then(() => {
            console.log('~==> Email sending processed successfully!')
            if (onComplete) {
                onComplete();
            }
        })
        .catch((error) => {
            console.error("~==> Email sending failed with error: ", error)
            if (onError) {
                onError(error);
            }
        })
}

 function validateRecaptcha(token) {

    let myRet = {
        'success': false
    };
     //const secret = "6LcDVnsbAAAAAF3e7tScXim8Kd2JoOFY3fZ74Vqu"; //development
    const secret = process.env.RECAPTCHA_SECRET_KEY; //production
    const url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret + "&response=" + token
    //

    return new Promise((resolve, reject) => {
        https.get(url, (req) => {

            var accumulatedData = "";
            var post = "";
            req.on('data', function (chunk) {
                accumulatedData += chunk;
            });

            req.on('end', function () {

                post = JSON.parse(accumulatedData);
                myRet = post;
                resolve(myRet)

            })
        }).on("error", (err) => {
            console.log("Error: " + err.message);
            reject(myRet)
        })
    })
}


//exports
exports.apiMail = apiMail;



