const express = require("express");
let app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  next();
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());
let axios=require("axios")
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


app.post('/post', async (req, res) => {
  const { method, fetchURL, data, headers } = req.body;
  try {
      let response;
      const requestOptions = { headers: headers || {} };

      if (!data && (method === 'POST' || method === 'PUT')) {
        return res.status(400).json({ error: 'Data should not be empty for POST or PUT requests.' });
      }
      if (method === 'GET') {
          response = await axios.get(fetchURL, requestOptions);
        
      } else if (method === 'POST') {
          response = await axios.post(fetchURL, JSON.parse(data), requestOptions);
         
      } else if (method === 'PUT') {
          response = await axios.put(fetchURL, JSON.parse(data), requestOptions);
      } else if (method === 'DELETE') {
          response = await axios.delete(fetchURL, requestOptions);
      }

  
      const status = response.status;
      res.header('X-Status', status);
      res.header('X-Method', method);
  
      res.json(response.data);
    
  } catch (error) {
      if (error.response) {
        
          const statusCode = error.response.status;
         
              res.status(statusCode).send( error.response.statusText);
              console.log(statusCode,'123');
            }
        
      }
});


app.get('/employees', (req, res) => {
  let departmentStr = req.query.department;
  let designationStr = req.query.designation;
  let genderStr = req.query.gender;

  let sql = 'SELECT * FROM employees WHERE 1=1';
  let params = [];

  if (departmentStr) {
    sql += ' AND department = $1';
    params.push(departmentStr);
  }

  if (designationStr) {
    sql += ' AND designation = $2';
    params.push(designationStr);
  }

  if (genderStr) {
    sql += ' AND gender = $3';
    params.push(genderStr);
  }

  client.query(sql, params, (err, data) => {
    if (err) {
      res.status(500).send(err); 
    } else {
      res.send(data.rows); 
    }
  });
})




  app.get('/employees/:empCode', (req, res) => {
    let empCode = +req.params.empCode;
  
    const sql = 'SELECT * FROM employees where empCode=$1';
    const params = [empCode];
  
    client.query(sql, params, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(data.rows);
      }
    });
  });
  


  app.get('/employees/department/:department', (req, res) => {
    let department=req.params.department
    const sql = 'SELECT * FROM employees where department=$1';
    const params = [department];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
     }
    });
  });

 app.get('/employees/designation/:designation', (req, res) => {
    let designation=req.params.designation
    const sql = 'SELECT * FROM employees where designation=$1';
    const params = [designation];

    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
     }
    });
  });

  app.get('/employees/gender/:gender', (req, res) => {
    let gender=req.params.gender
    const sql = 'SELECT * FROM employees where gender=$1';
    const params = [gender];

    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data.rows );
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
    let empCode = +req.params.empCode;
    let body = req.body;
    const sql = 'UPDATE employees SET name=$1, department=$2, designation=$3, salary=$4, gender=$5 WHERE empCode=$6';
  
    const params = [body.name, body.department, body.designation, body.salary, body.gender, empCode];
  
    client.query(sql, params, (err, data) => {
      if (err) {
        res.status(404).send(err);
      } else {
        res.send(data.rows);
      }
    });
  });

  app.delete('/employees/:empCode', (req, res) => {
    let empCode=req.params.empCode
    const sql = 'delete from employees where empCode=$1';
    const params = [empCode];
    client.query(sql,params, (err, data) => {
      if (err)  res.status(404).send( err);
     else{
      res.send( data );
     }
    });
  });

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


    app.get('/shops', (req, res) => {  
      const sql = 'SELECT shopId,name FROM shops ';
      client.query(sql, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(data.rows);
        
        }
      });
    });
   
  
    app.get('/shops/:id', (req, res) => {
      let id = +req.params.id;
    
      const sql = 'SELECT * FROM shops where shopid=$1';
      const params = [id];
    
      client.query(sql, params, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(data.rows);
        }
      });
    });
    app.post('/shops', (req, res) => {
      const body = req.body;
      const sql = 'INSERT INTO shops ( name,rent) VALUES ($1, $2)';
      const values = [ body.name, body.rent];
    
      client.query(sql, values, (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({ message: 'Shop added successfully', data: data.rows });
        }
      });
    });
    // app.get('/products', (req, res) => {  
    //   const sql = 'SELECT * FROM products ';
    //   client.query(sql, (err, data) => {
    //     if (err) {
    //       res.status(404).send(err);
    //     } else {
    //       res.send(data.rows);
    //     }
    //   });
    // });
    // app.get('/products/:id', (req, res) => {
    //   let id = +req.params.id;
    
    //   const sql = 'SELECT * FROM products where productid=$1';
    //   const params = [id];
    
    //   client.query(sql, params, (err, data) => {
    //     if (err) {
    //       res.status(404).send(err);
    //     } else {
    //       res.send(data.rows);
    //     }
    //   });
    // });
   
  
    // app.post('/products', (req, res) => {
    //   const body = req.body;
    //   const sql = 'INSERT INTO products (productname, category, description) VALUES ($1, $2, $3)';
    //   const values = [body.productname, body.category, body.description];
    
    //   client.query(sql, values, (err, data) => {
    //     if (err) {
    //       res.status(500).json({ error: err.message });
    //     } else {
    //       res.status(201).json({ message: 'Product added successfully', data: data.rows });
    //     }
    //   });
    // });
    
    // app.put('/products/:productid', (req, res) => {
    //   let productid = +req.params.productid;
    //   let body = req.body;
    //   const sql = 'UPDATE products SET  category=$1, description=$2, productname=$3 WHERE productid=$4';
    
    //   const params = [ body.category, body.description,body.productname,  productid];
    
    //   client.query(sql, params, (err, data) => {
    //     if (err) {
    //       res.status(404).send(err);
    //     } else {
    //       res.send(data.rows);
    //     }
    //   });
    // });
  
    
  
  
  
    app.post('/purchases', (req, res) => {
      const body = req.body;
      const sql = 'INSERT INTO purchases (shopid,productid, quantity, price) VALUES ($1, $2, $3,$4)';
      const values = [body.shopid, body.productid, body.quantity, body.price];
    
      client.query(sql, values, (err, data) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({ message: 'Product added successfully', data: data.rows });
        }
      });
    });
  
   
    
   
  
    app.get('/totalPurchase/product/:id', (req, res) => {
      const productId = +req.params.id;
      const sql = `
        SELECT purchases.*, shops.name, products.productname, products.category, products.description
        FROM purchases
        JOIN shops ON purchases.shopid = shops.shopid
        JOIN products ON purchases.productid = products.productid
        WHERE products.productid = $1
      `;
      const values = [productId];
    
      client.query(sql, values, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(data.rows);
        }
      });
    });
    
    app.get('/totalPurchase/shop/:id', (req, res) => {
      const shopId = +req.params.id;
      const sql = `
        SELECT purchases.*, shops.name, products.productname, products.category, products.description
        FROM purchases
        JOIN shops ON purchases.shopid = shops.shopid
        JOIN products ON purchases.productid = products.productid
        WHERE shops.shopId = $1
      `;
      const values = [shopId];
    
      client.query(sql, values, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(data.rows);
        }
      });
    });
     
    app.get('/totalPurchase/product/:id', (req, res) => {
      const productId = +req.params.id;
      const sql = 'SELECT shopid, SUM(quantity) AS total_quantity FROM purchases WHERE productid = $1 GROUP BY shopid';
      const values = [productId];
    
      client.query(sql, values, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
          res.send(data.rows);
        }
      });
  
    });
  
  
  
    // app.get('/purchases', (req, res) => {
    //   let shop = req.query.shop;
    //   let productIds = req.query.product; 
    //   let sort = req.query.sort;
    
    //   const removeEvery2Chars = (input) => {
    //     return input.replace(/(..)/g, '');
    //   };
    
    //   if (productIds) {
    //     productIds = productIds.split(',').map(removeEvery2Chars);
    //   }
    
    //   if (shop) {
    //     shop = shop.slice(2);
    //   }
    
    //   let sql = `
    //     SELECT purchases.*, shops.name, products.productname, products.category, products.description
    //     FROM purchases
    //     JOIN shops ON purchases.shopid = shops.shopid
    //     JOIN products ON purchases.productid = products.productid
    //   `;
    
    //   const params = [];
    //   const conditions = [];
    
    //   if (shop) {
    //     conditions.push('shops.shopid = $' + (params.length + 1));
    //     params.push(shop);
    //   }
    
    //   if (productIds && productIds.length > 0) {
    //     conditions.push('products.productid IN (' + productIds.map((_, i) => '$' + (params.length + i + 1)).join(', ') + ')');
    //     params.push(...productIds);
    //   }
    
    //   if (conditions.length > 0) {
    //     sql += ' WHERE ' + conditions.join(' AND ');
    //   }
    
    //   if (sort) {
    //     const sortOptions = sort.split(',');
    //     const orderBy = sortOptions.map((option) => {
    //       switch (option) {
    //         case 'QtyAsc':
    //           return 'quantity ASC';
    //         case 'QtyDesc':
    //           return 'quantity DESC';
    //         case 'ValueAsc':
    //           return 'price*quantity ASC';
    //         case 'ValueDesc':
    //           return '(price * quantity) DESC';
    //         default:
    //           return '';
    //       }
    //     });
    
    //     if (orderBy.length > 0) {
    //       sql += ' ORDER BY ' + orderBy.join(', ');
    //     }
    //   }
    
    //   client.query(sql, params, (err, data) => {
    //     if (err) {
    //       res.status(500).send(err);
    //     } else {
    //       res.send(data.rows);
    //     }
    //   });
    // });
    app.get("/purchases", async (req, res) => {
      const shopId = req.query.shop;
      const productId = req.query.product;
      const sort = req.query.sort;
    
      let sql = `
        SELECT purchases.*, shops.name, products.productname, products.category, products.description
        FROM purchases
        JOIN shops ON purchases.shopid = shops.shopid
        JOIN products ON purchases.productid = products.productid
      `;
    
      const params = [];
      const conditions = [];
    
      if (shopId) {
        conditions.push('shops.shopid = $' + (params.length + 1));
        params.push(parseInt(shopId.replace("st", ""), 10));
      }
    
      if (productId) {
        const productIdNums = productId.split(',').map(id => parseInt(id.replace("pr", ""), 10));
        conditions.push('products.productid IN (' + productIdNums.map((_, i) => '$' + (params.length + i + 1)).join(', ') + ')');
        params.push(...productIdNums);
      }
    
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }
    
      if (sort === 'QtyAsc') {
        sql += ' ORDER BY quantity ASC';
      } else if (sort === 'QtyDesc') {
        sql += ' ORDER BY quantity DESC';
      } else if (sort === 'ValueAsc') {
        sql += ' ORDER BY price * quantity ASC';
      } else if (sort === 'ValueDesc') {
        sql += ' ORDER BY price * quantity DESC';
      }
    
      try {
        const { rows } = await client.query(sql, params);
        res.send(rows);
      } catch (err) {
        console.error(err);
        res.status(500).send(err);
      }
    });
    
   app.get('/totalPurchases/:id', (req, res) => {
    
      let id=req.params.id
      const sql = `
      SELECT pd.productid, pd.productname, s.shopid,s.name, SUM(p.quantity) AS totalQuantity, p.price
      FROM products pd
      JOIN purchases p ON pd.productid = p.productid
      JOIN shops s ON s.shopid = p.shopid
      WHERE s.shopid = ${id}
      GROUP BY pd.productid, pd.productname, s.shopid, p.price ,s.name;
  `;
  
  
      client.query(sql, (err, data) => {
        if (err) {
          res.status(404).send(err);
        } else {
         
          res.send(data.rows);
        }
      });
    });
    
    let productsArr = [
      {
        id: 1,
        category: "Watches",
        description:
          "The look that made Swiss watches the toast of the world. Still unbeatable.",
        imgLink:
          "https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
        name: "Silver",
        price: 1600,
      },
      {
        id: 2,
        category: "Watches",
        description: "Dark, black beauty. Sure to look good on the wrist.",
        imgLink:
          "https://images.pexels.com/photos/1697566/pexels-photo-1697566.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Black",
        price: 899,
      },
      {
        id: 3,
        category: "Watches",
        description:
          "Multi chronographs, stop watch, timers. Altimeter. What else.",
        imgLink:
          "https://images.pexels.com/photos/2113994/pexels id-photo-2113994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Chronograph",
        price: 1199,
      },
      {
        id: 4,
        category: "Watches",
        description: "For all ages. For all times. Classic Look. Classic leather.",
        imgLink:
          "https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Classic",
        price: 1250,
      },
      {
        id: 5,
        category: "Watches",
        description: "The original Apple Watch. Still a great buy.",
        imgLink:
          "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        name: "Apple v1",
        price: 999,
      },
      {
        id: 6,
        category: "Watches",
        description: "Mechanical 28 jewelled watch. Connoisseur delight.",
        imgLink:
          "https://images.pexels.com/photos/47339/mechanics-movement-feinmechanik-wrist-watch-47339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Jewelled",
        price: 1999,
      },
      {
        id: 7,
        category: "Sunglasses",
        description: "Desirable, reddish tint. Sure to attract attention.",
        imgLink:
          "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Tinted Red",
        price: 399,
      },
      {
        id: 8,
        category: "Sunglasses",
        description: "Nostalgic, bluish tint, sure to get memories back. Vintage.",
        imgLink:
          "https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Oldies",
        price: 199,
      },
      {
        id: 9,
        category: "Sunglasses",
        description: "Trendy, young sunglasses with retro look. Teen favourite.",
        imgLink:
          "https://images.pexels.com/photos/1362558/pexels-photo-1362558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        name: "Youthful",
        price: 219,
      },
      {
        id: 10,
        category: "Sunglasses",
        description: "Chic sunglasses. Classic dark shades, sure to generate envy.",
        imgLink:
          "https://images.pexels.com/photos/65659/glasses-glass-circle-light-transmittance-65659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        name: "Classic Dark",
        price: 249,
      },
      {
        id: 11,
        category: "Watches",
        description: "Apple Watch Version 2. A delight.",
        imgLink:
          "https://images.pexels.com/photos/277406/pexels-photo-277406.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        name: "Apple v2",
        price: 1499,
      },
      {
        id: 12,
        category: "Belts",
        description: "Stylish formal brown belt. An office favourite.",
        imgLink:
          "https://as1.ftcdn.net/jpg/02/14/48/72/500_F_214487233_Aahw3DohDu6dSSfMqWCcU1QDatxpDt6E.jpg",
        name: "Fab Brown",
        price: 149,
      },
      {
        id: 13,
        category: "Handbags",
        description: "Desirable travel bag. Mix of convenience and style",
        imgLink:
          "https://images.pexels.com/photos/2534961/pexels-photo-2534961.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        name: "Travel Lite",
        price: 199,
      },
      {
        id: 14,
        category: "Handbags",
        description: "3 Pockets, 2 Zips -  ideal for shopping and parties",
        imgLink:
          "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        name: "Chic Leather",
        price: 749,
      },
      {
        id: 15,
        category: "Belts",
        description: "Signature belt from Gucci ",
        imgLink:
          "https://img.shopstyle-cdn.com/pim/c7/a6/c7a695a8db5a375b222f15bea045bdea_xlarge.jpg",
        name: "Raw Edge",
        price: 799,
      },
      {
        id: 16,
        category: "Belts",
        description: "Iconic metallic belt",
        imgLink:
          "https://img.shopstyle-cdn.com/pim/81/78/8178fa6c3b27d3f3e0fe18d019c992ea_xlarge.jpg",
        name: "Goofy Black",
        price: 349,
      },
      {
        id: 17,
        category: "Sunglasses",
        description: "Min black faded front shades",
        imgLink:
          "https://cdn.shopify.com/s/files/1/0898/5824/products/QUAY_HIGHKEY_Mini_BLACK_FADE_FRONT_450x.jpg",
        name: "Quay Shades",
        price: 479,
      },
      {
        id: 18,
        category: "Belts",
        description: "Evergreen formal belt with classic buckle",
        imgLink:
          "https://as1.ftcdn.net/jpg/02/02/45/86/500_F_202458696_CYlcJbJfjgUb2VgQnPSUxHU79v6I3SC6.jpg",
        name: "Classic Brown",
        price: 128,
      },
      {
        id: 19,
        category: "Handbags",
        description: "Beach handbag to go along with a beach holiday",
        imgLink:
          "https://images.pexels.com/photos/2305000/pexels-photo-2305000.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        name: "Funky Jute",
        price: 99,
      },
      
    ];
    
    
    
    let customers=[
      {name:"Jack",email:"email@Test.com",password:"test1234",id:1}
    ]
    
    let orders=[
      {name:"Charu Sharma",address:"Building no 28, Sector 140",city:"Gurgaon",amount:2197,items:3}
    ]
    
    
    
    app.post("/login", function(req, res) {
    let {email,password}=req.body
    
      let cust = customers.find(function(item) {
        return item.email === email && item.password === password;
      });
      console.log(cust);
      var custRec= {
        name: cust.name,
        email:cust.email
      }
      console.log(custRec);
     
      res.send(custRec);
    });
    
    app.get("/orders",function(req,res){
    res.send(orders)
    })
    app.post("/orders", (req, res) => {
      let newOrder = req.body;
      newOrder.id = orders.length + 1;
      orders.push(newOrder);
      res.send(newOrder)
      console.log(newOrder, "ghjk");
    });
    
    
    app.get("/products/:category?", (req, res) => {
      const { category } = req.params;
      const filteredProducts = category
        ? productsArr.filter((product) => product.category === category)
        : productsArr;
    
      res.json(filteredProducts);
    });
    
    app.get("/product/:id", (req, res) => {
      const { id } = req.params;
      const findProduct = productsArr.find((product) => product.id === +id);
    
      res.json(findProduct);
    });
    
    app.post("/products", (req, res) => {
      let newProduct = req.body;
      newProduct.id = productsArr.length + 1;
      productsArr.push(newProduct);
      res.send(newProduct), console.log(newProduct, "ghjk");
    });
    
    app.put('/products/:id', (req, res) => {
        const updatedProduct= req.body;
        const {id} = req.params
        const index = productsArr.findIndex((product) => product.id === +id);
      
        if (index >= 0) {
          productsArr[index] = { ...productsArr[index], ...updatedProduct };
         
          res.send(productsArr[index]);
        
        } else {
          res.status(404).send("Product not found");
        }
       
      });
    
    
      app.delete("/products/:id", function (req, res) {
        let id = req.params.id;
        
        let index = productsArr.findIndex((obj1) => obj1.id === +id);
        if (index >= 0) {
          let product = productsArr.splice(index, 1);
          res.send(product);
          console.log(product);
        }
      else   res.status(404).send("Product not found");
      });
    
    
      let furnitureUsers = [
  { email: "user@user.com", password: "user1234", role: "user" },
  { email: "admin@admin.com", password: "admin1234", role: "admin" },
];

app.post("/loginUser", (req, res) => {
  let { username, password } = req.body;
  let loginUser = furnitureUsers.find(
    (u1) => u1.email === username && u1.password === password
  );
  if (loginUser) {
    let cusData = {
      username: loginUser.email,
      password: loginUser.password,
      role: loginUser.role,
    };
    res.send(cusData);
  } else {
    res.status(401).send("Unauthorized");
  }
});