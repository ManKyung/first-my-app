var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

var app = express();

mongoose.connect(process.env.MONG_DB);
var db = mongoose.connection;

db.once('open',function(){
	console.log("DB Connected");
});

db.once('error',function(err){
	console.log("DB Error : "+err);
});

var dataSchema = mongoose.Schema({
	name:String,count:Number
});

var Data = mongoose.model('data',dataSchema);


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));
console.log(__dirname);

var data = {count:0};
app.get('/',function(req, res){
	//res.send("Hello World!");
	Data.findOne({name:"myData"}, function(err,data){
		if(err){return console.log('Data error : '+err);}
		data.count++;
		data.save(function(err){
			if(err){
				return console.log("error");
			}
			res.render('my_first_ejs',data);
		});
	});
});

app.get('/reset',function(req,res){
	data.count = 0;
	res.render('my_first_ejs',data);
});

app.get('/set/count',function(req,res){
	if(req.query.count){
		data.count = req.query.count;
	}
	res.render('my_first_ejs',data);
});

app.get('/set/:num',function(req,res){
	data.count = req.params.num;
	res.render('my_first_ejs',data);
});


app.listen(80, function(){
	console.log('server On');
});