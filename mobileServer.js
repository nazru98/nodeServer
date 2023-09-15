let express=require("express")
let app=express()
app.use(express.json());
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Methods',
    'GET , POST , OPTIONS ,  PUT , PATCH, DELETE, HEAD'
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'  
    )
    next()
});
const {Client}=require("pg");
const client= new Client({
  user: "postgres",
  password:"Nazruddin@98",
  database:"postgres",
  port :5432,
  host:"db.jmsdxeylcwhqqargycvr.supabase.co",
  ssl:{rejectUnauthorized:false}
  })
  client.connect(function(res,error){console.log("connected!!!!");
  });

const port=2410;
app.listen(port,()=>console.log(`Listening on port ${port} !`))



// app.get('/mobiles', (req, res) => {
//   let RAM = req.query.RAM;
//   let ROM = req.query.ROM;
//   let OS = req.query.OS;
//   let brand = req.query.brand;

//   let sql = 'SELECT * FROM mobiles WHERE 1=1';
//   let params = [];

//   if (RAM) {
//     sql += ' AND RAM = $1';
//     params.push(RAM);
//   }

//   if (ROM) {
//     sql += ' AND ROM = $2';
//     params.push(ROM);
//   }

//   if (OS) {
//     sql += ' AND OS = $3';
//     params.push(OS);
//   }
//   if (brand) {
//     sql += ' AND brand = $4';
//     params.push(brand);
//   }
//   client.query(sql, params, (err, data) => {
//     if (err) {
//       res.status(500).send(err); 
//     } else {
//       res.send(data.rows); 
//     }
//   });
// })

app.get('/mobiles', (req, res) => {
  let RAM = req.query.RAM;
  let ROM = req.query.ROM;
  let brand = req.query.brand;

  let sql = 'SELECT * FROM mobiles WHERE 1=1';
  let params = [];

  if (RAM && RAM.length > 0) {
    const ramValues = RAM.split(','); 
    sql += ` AND RAM IN (${ramValues.map((_, index) => `$${index + 1}`).join(', ')})`;
    params.push(...ramValues);
  }

  if (ROM && ROM.length > 0) {
    const romValues = ROM.split(','); 
    sql += ` AND ROM IN (${romValues.map((_, index) => `$${params.length + index + 1}`).join(', ')})`;
    params.push(...romValues);
  }

  
  if (brand && brand.length > 0) {
    const brandValues = brand.split(','); 
    sql += ` AND brand IN (${brandValues.map((_, index) => `$${params.length + index + 1}`).join(', ')})`;
    params.push(...brandValues);
  }

  client.query(sql, params, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data.rows);
    }
  });
});

  

  
  app.get('/mobiles/:id', (req, res) => {
    let id = +req.params.id;
  
    const sql = 'SELECT * FROM mobiles where id=$1';
    const params = [id];
  
    client.query(sql, params, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(data.rows);
      }
    });
  });
  
  app.get('/mobiles/RAM/:RAM', (req, res) => {
    let RAM=req.params.RAM
    const sql = 'SELECT * FROM mobiles where RAM=$1';
    const params = [RAM];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
     }
    });
  });
  
 

  app.get('/mobiles/ROM/:ROM', (req, res) => {
    let ROM=req.params.ROM
    const sql = 'SELECT * FROM mobiles where ROM=$1';
    const params = [ROM];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
     };
    });
  });
  

  app.get('/mobiles/OS/:os', (req, res) => {
    let os=req.params.os
    const sql = 'SELECT * FROM mobiles where os=$1';
    const params = [os];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
     }
    });
  });
  

  app.get('/mobiles/brand/:brand', (req, res) => {
    let brandArr=req.params.brand
    const sql = 'SELECT * FROM mobiles where brand=$1';
    const params = [brandArr];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
     }
    });
  });
  
  app.post('/mobiles', (req, res) => {
    const body = req.body;
    const sql = 'INSERT INTO mobiles ( name, price, brand, RAM, ROM,OS) VALUES ($1, $2, $3, $4, $5, $6 )';
    const values = [ body.name, body.price, body.brand, body.ram, body.rom,body.os];
  
    client.query(sql, values, (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ message: 'Employee added successfully', data: data.rows });
      }
    });
  });

  app.put('/mobiles/:id', (req, res) => {
    let id = +req.params.id;
    let body = req.body;
    const sql = 'UPDATE mobiles SET name=$1,price=$2, brand=$3, RAM=$4, ROM=$5, OS=$6 WHERE id=$7';
  
    const params = [body.name, body.price, body.brand, body.ram, body.rom, body.os, id];
  
    client.query(sql, params, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(data.rows);
      }
    });
  });

  app.delete('/mobiles/:id', (req, res) => {
    let id=+req.params.id
    const sql = 'delete from mobiles where id=$1';
    const params = [id];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });