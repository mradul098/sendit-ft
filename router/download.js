const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid',async(req,res)=>{
    const file = await File.findOne({uuid:req.params.uuid}); //uuid is one of the variable parameters of url it is being fetched and based on the uuid we will find the object of the same id

    if(!file){
        return  res.render('download',{error:'link has been expired.'});
    }

    const filePath = `${__dirname}/../${file.path}`; //there are multiple params in an object like id , filename , uuid , path , size now we are concatinating the current directory to where the file exists so that we can download it
    res.download(filePath);
});

module.exports = router;