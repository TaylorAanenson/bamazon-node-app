var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "tay",
  database: "bamazon"
});

connection.connect(function connecter(err) {
  if (err) throw err;
  inquirer.prompt([{
    type: 'password',
    name: 'pass',
    message: 'Please enter password'
    }
    ]).then(function(data){
        if(data.pass === 'bamaman'){
            var timer = setInterval(initializer,1000);
            console.log("Initializing interface.. ");
            function initializer(){
                clearInterval(timer);
                console.log("Welcome. Connected as id "+connection.threadId);
                manageProducts();
            }
        }else{
            console.log('Incorrect! Try again..');
            connecter();
        }
    });

});

function manageProducts(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }
    ]).then(function(data){
        if(data.action === 'View Products for Sale'){
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (i in res){
                    console.log(res[i]);
                }
                connection.end();
                });
        }else if(data.action === 'View Low Inventory'){
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (i in res){
                    var quant = res[i].quantity;
                    if(quant < 5){
                        console.log(res[i]);
                    }else{
                        console.log('Quants are all good! :)')
                    }
                }
                connection.end();
                });
        }else if(data.action === 'Add to Inventory'){
            var timer;
            var selectedID = '';
            var selectedName = '';
            var selectedQuant;
            timer = setInterval(addInventory,100);
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                for (i in res){
                    console.log(res[i]);
                }
            });
            function addInventory(){
                clearInterval(timer);
                inquirer.prompt([{
                    type: 'input',
                    name: 'product_id',
                    message: 'Input the ID of the item you would like to update'
                }
                ]).then(function(data){
                    connection.query(
                        "SELECT * FROM products WHERE ?",{
                            id: data.product_id,
                        },function(err,res){
                            if(err) throw err;
                            console.log(res[0]);
                            selectedID = res[0].id;
                            selectedName = res[0].product;
                            selectedQuant = parseFloat(res[0].quantity);
                            timer = setInterval(confirmID,100);
                        });
                function confirmID(){
                    clearInterval(timer);
                    inquirer.prompt([{
                        type: 'confirm',
                        name: 'action',
                        message: 'Is this the correct item?'
                    }
                    ]).then(function (data){
                        if(data.action === true){
                            inquirer.prompt([{
                                type: 'input',
                                name: 'add_quantity',
                                message: 'How many you would like to add?'
                            }
                    ]).then(function(data){
                        var addQuant = parseFloat(data.add_quantity);
                        var newQuant = parseFloat(selectedQuant += addQuant);
                        console.log('   '+addQuant);
                        inquirer.prompt([{
                            type: 'confirm',
                            name: 'action',
                            message: 'Is this the correct quantity?'
                        }
                    ]).then(function(data){
                        if(data.action === true){
                            connection.query(
                                "UPDATE products SET ? WHERE ?",[
                                {
                                    quantity: newQuant
                                },
                                {
                                    id: selectedID
                                }],
                                function(err, res) {
                                    if(err) throw err;
                                    console.log(selectedName+' has been updated to '+newQuant);
                                }
                            );
                            connection.end();
                        }else{
                            confirmID();
                        }
                    });
                    });
                        }else{
                            addInventory();
                        }
                    });
                }
                }
                );
            }
        }else if(data.action === 'Add New Product'){
            addProduct();
            function addProduct(){
                inquirer.prompt([{
                    type: 'input',
                    name: 'product_name',
                    message: "What is the product's name?"
                },
                {
                    type: 'input',
                    name: 'product_department',
                    message: 'What department does it belong in?'
                },
                {
                    type: 'input',
                    name: 'product_price',
                    message: 'What price is it going to be listed at?'
                },
                {
                    type: 'input',
                    name: 'product_quantity',
                    message: 'How many are we going to have in stock?'
                }
                ]).then(function(data){
                    var name = JSON.stringify(data.product_name);
                    var depart = JSON.stringify(data.product_department);
                    var price = parseFloat(data.product_price);
                    var quant = parseFloat(data.product_quantity);
                    inquirer.prompt([{
                        type: 'confirm',
                        name: 'action',
                        message: 'Is everything correct?'
                    }
                    ]).then(function (data){
                        if(data.action === true){
                            var query = connection.query(
                                "INSERT INTO products (product,department,price,quantity) VALUES ("+name+","+depart+","+price+","+quant+")"
                                ,function(err,res){
                                    if(err) throw err;
                                    console.log('Product inserted successfully');
                                });
                                connection.end();
                        }else{
                            addProduct();
                        }
                    });
                });
            }
        }
    });
}