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


app.get('/employees', (req, res) => {
  let departmentStr=req.query.department
    let designationStr=req.query.designation
    let genderStr=req.query.gender
    // let connection=mysql.createConnection(connData);
    let sql = 'SELECT * FROM employees where 1';
    let params = [];

  if (departmentStr) {
    sql += ' AND department = ?';
    params.push(departmentStr);
  }

  if (designationStr) {
    sql += ' AND designation = ?';
    params.push(designationStr);
  }

  if (genderStr) {
    sql += ' AND gender = ?';
    params.push(genderStr);
  }
  client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
      res.send( data );
    });
  });

  app.get('/employees', (req, res) => {
    let empCode = +req.params.id;
  
    const sql = 'SELECT * FROM employees';
  
  
    client.query(sql, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(data.rows);
      }
    });
  });
  


  app.get('/employees/department/:department', (req, res) => {
    let department=req.params.department
    // let connection=mysql.createConnection(connData);
    const sql = 'SELECT * FROM employees where department=?';
    client.query(sql,department, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });

 app.get('/employees/designation/:designation', (req, res) => {
    let designation=req.params.designation
    // let connection=mysql.createConnection(connData);
    const sql = 'SELECT * FROM employees where designation=?';
    client.query(sql,designation, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });

  app.get('/employees/gender/:gender', (req, res) => {
    let gender=req.params.gender
    // let connection=mysql.createConnection(connData);
    const sql = 'SELECT * FROM employees where gender=?';
    client.query(sql,gender, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });
  app.post('/employees', (req, res) => {
    const body = req.body;
    const sql = 'INSERT INTO employees (empCode, name, department, designation, salary, gender) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [body.empCode, body.name, body.department, body.designation, body.salary, body.gender];
  
    client.query(sql, values, (err, data) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ message: 'Employee added successfully', data: data.rows });
      }
    });
  });
  

  app.put('/employees/:empCode', (req, res) => {
    let empCode=+req.params.empCode
    let body=req.body
    // let connection=mysql.createConnection(connData);
    const sql = 'update employees set name=?,department=?,designation=? ,salary=?,gender=? where empCode=?';

    client.query(sql,[body.name,body.department,body.designation,body.salary,body.gender,empCode], (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });

  app.delete('/employees/:empCode', (req, res) => {
    let empCode=+req.params.empCode
    // let connection=mysql.createConnection(connData);
    const sql = 'delete from employees where empCode=?';
    client.query(sql,empCode, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });