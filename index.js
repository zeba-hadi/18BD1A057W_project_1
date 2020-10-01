const express=require('express');
const app=express();

//body parser
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//for mongodb
const MongoClient=require('mongodb').MongoClient;
//Connecting server file for AWT
let server=require('./server');
let middleware=require('./middleware');  
//Database Connection
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalInventory';
let db
MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log(`Connected Database : ${url}`);
    console.log(`Database : ${dbName}`);
});
//FETCHING HOSPITAL DETAILS
app.get('/hospitaldetails',middleware.checkToken,function(req,res)
{
    console.log("Fetching data from Hospital Collection");
    var data=db.collection('hospital').find().toArray().then(result=>res.json(result));
});
//VENTILATORS DETAILS
app.get('/ventilatordetails',middleware.checkToken,(req,res)=>
{
    console.log("Ventilators Information");
    var ventilatordetails=db.collection('ventilators').find().toArray().then(result=>res.json(result));
});
//SEARCH VENTILATORS BY STATUS
app.post('/searchventbystatus',middleware.checkToken,(req,res)=>
{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilators').find({"status":status}).toArray().then(result=>res.json(result));
});
//SEARCH VENTILATORS BY HOSPITAL NAMES
app.post('/searchventbyname',middleware.checkToken,(req,res)=>
{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilators').find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});
//SEARCH HOSPITAL BY NAME
app.post('/searchhospital',middleware.checkToken,(req,res)=>
{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospital').find({'name':new RegExp(name,'i')}).toarra().then(result=>res,json(result));
});
//UPDATE VENTILATOR DETAILS
app.put('/updateventilator',middleware.checkToken,(req,res)=>
{
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvaules={$set:{status:req.body.status}};
    db.collection("ventilator").updateOne(ventid,newvaules,function(err,result)
    {
        res.json('1 document updated');
        if (err) throw err;
        //console.log("1 document updated");
    });
});
//ADD VENTILATOR
app.post('/addventilator',middleware.checkToken,(req,res)=>
{
    var hId=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item=
    {
        hId:hId,ventilatorId:ventilatorId,status:status,name:name
    };
    db.collection('ventilator').insertOne(item,function(err,result)
    {
        res.json('Item Inserted');
    });
});
//DELETE VENTILATOR BY VENTILATORID
app.post('/delete',middleware.checkToken,(req,res)=>
{
    var myquery=req.query.ventilatorId;
    console.log(myquery);
    var myquery1={ventilatorId:myquery};
    db.collection('ventilator').deleteOne(myquery1,function(err,obj)
    {
        if (err) throw err;
        res.json("1 document deleted");
    });
});
app.listen(1100);