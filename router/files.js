const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const File = require('../models/file');
const {v4:uuid4} = require('uuid'); //used to generate the uuid, uuid as we dont want multiple files to have same url

let storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,'uploads/'),
    filename:(req,file,cb)=>{
        const unique_name = `${Date.now()}--${file.originalname}`; //file was not being uploaded because there was a problem with the name
        cb(null,unique_name);
    }
});

let upload = multer({   //remember in the multer explaination we defined upload and then called upload.single() 
    storage,
    limit:{fileSize:1000000*100},
}).single('myfile');

router.post('/',(req,res)=>{
  
    //store file
    upload(req,res,async(err)=>{
        //validate request
        
        if(err){
            return res.status(500).send({error:err.message});
        }
        //store into databse
        const file = new File({
            filename:req.file.filename, //req.file is the file and its original filename 
            uuid: uuid4(), //generated a random uuid
            path:req.file.path,
            size:req.file.size
        });
        //saving the file in db
        const response = await file.save(); //remember the await we used inplace of the promises the deal is just await for the respone if you get the respones then great otherwise catch the error
        return res.json({file:`${process.env.APP_BASE_URL}files/${response.uuid}`});
        //the link that will be send will look something like this http://localhost:3000/files/2345dsfsg-234gjkasdf
    });
});

//we used the gmail smtp to send the email our email id secondpart00@gmail.com is the host for instance means the mails are going to be sent from this one and 
//if it gives some error that our host is blocking us to do so then we need to loosen up our gmail security a bit
//see tutorial for nodemailer https://www.youtube.com/watch?v=nF9g1825mwk&t=165s 

router.post('/send', (req, res) => {
    const {uuid,emailTo,emailFrom} = req.body;
    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Name: ${req.body.emailFrom}</li>

        <li>Email: ${req.body.emailTo}</li>
        
      </ul>
      <h3>Message</h3>
      
    `;
  
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: process.env.MAIL_ID, // generated ethereal user
          pass: process.env.PASS  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
  
    const file = File.findOne({ uuid: uuid });
    // setup email data with unicode symbols
    let mailOptions = {
        from: emailFrom, // sender address
        to: emailTo, // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: require('../services/emailTemplate')({
            emailFrom, 
            downloadLink: `${process.env.APP_BASE_URL}files/${req.body.uuid}?source=email` ,
            size: parseInt(file.size/1000000) + ' MB',
            expires: '24 hours'
        })
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('contact', {msg:'Email has been sent'});
    });
    });
  
module.exports = router;
