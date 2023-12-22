import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

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
  return  db.select('*').from('clothings')
    .then(data=>{     
    res.json(data);
})
})


app.post('/clothings',(req,res)=>{//Add Clothings
        const {clothName,clothPicture,clothPrice} = req.body;
        if(!clothName||!clothPicture||!clothPrice){
                res.status(400).json('Enter all fields');
                return;
        }
                db('clothings').insert({  
                                clopthpicture: clothPicture,                 
                                clothname: clothName,
                                clothprice: clothPrice                
                            })
                            return "Saved"
                    })

    app.get('/userx',(req,res)=>{//Get users
                return  db.select('*').from('userx')
                .then(user=>{    
                res.json(user);
            })
})

app.post('/login',(req,res)=>{//login user
    const {email,password} = req.body;
        if(!email||!password){
                res.status(400).json('Incorrect Password')
        }
        const hash=bcrypt.hashSync(password);//Hashing password here

        db.select('password').from('userx')
		.where({email:email})
		.then(password=>{       
			if(password==hash){
              return  db.select('*').from('userx')
                .where({email:email}).then(
                    user=>{
                            res.json(user[0])
                    }
                )				
            }else{
						res.status(400).json('Not found')
				}
		}).catch(err=>res.status(400).json('erro getting user'))
	})

app.post('/userx',(req,res)=>{//Add user
        const {firstName,lastName,email,address,phone,password} = req.body;
        if(!firstName||!lastName||!email||!phone||!address||!password){
                res.status(400).json('Enter complete fields')
        }
        const hash=bcrypt.hashSync(password);//Hashing password here
         db('userx').insert({  
                            address: address,                                            
                            email: email,
                            firstname: firstName,
                            lastname: lastName,                          
                            password:hash,
                            phone:phone,
                    })
                    .then(user=>{
                        res.json(user[0]);
}) })


app.get('/userx/:id',(req,res)=>{//using Id to fetch user
	return	db.select('*').from('userx')
		.where({id:req.params.id})
		.then(user=>{
			if(user.length){
			res.json(user[0])
				}else{
						res.status(400).json('Not found')
				}
		}).catch(err=>res.status(400).json('erro getting user'))

	})


app.listen(process.env.PORT||3001,function(){
console.log(`Sever running at port: ${process.env.PORT}`);
});