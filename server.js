import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({    //connecting to database using knex
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'godwinonah',
    password : '',
    database : 'ObandeCloths'
  }
});

app.get('/clothings',(req,res)=>{//Get clothings
    db.returning('*').select('*').from('clothings')
    .then(data=>{     
    console.log(data);
    res.json(data);
})
})


app.post('/clothings',(req,res)=>{//Add Clothings

const {clothName,clothPicture,clothPrice} = req.body;

if(!clothName||!clothPicture||!clothPrice){

        res.status(400).json('Enter all fields')
}
console.log(req.body.clothPicture)

db.insert({                   
                clothname: clothName,
                clopthpicture: clothPicture,
                clothprice: clothPrice
                    
            }).then(clothings=>{

        res.json(clothings[clothings.length-1]);

    })
    
    })



app.get('/userx',(req,res)=>{//Get users
    db.select('*').from('userx')
    .then(data=>{    
    console.log(data);
  return res.json(data);
})
})

app.post('/login',(req,res)=>{//login user
    login.handleLogin(req,res,db,bcrypt)
})

app.post('/userx',(req,res)=>{//Add user

const {firstName,lastName,email,phone,address,password} = req.body;

if(!firstName||!lastName||!email||!phone||!address||!password){

        res.status(400).json('Enter complete fields')
}

const hash=bcrypt.hashsync(req.body.password);

db.insert({                   
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    address: address,
                    phone:phone,
                    password:password

            }).then(user=>{

        res.json(user[user.length-1]);

    })
    
    })


app.get('/userx/:id',(req,res)=>{//using Id to fetch user

		db.select('*').from('userx')
		.where({id:req.params.id})
		.then(user=>{
			if(user.length){
			res.json(user[0])
				}else{
						res.status(400).json('Not found')
				}
		}).catch(err=>res.status(400).json('erro getting user'))

	})


app.listen(3001,function(){
console.log('Sever running at port: 3001');
});