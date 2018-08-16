var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "tay",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  
  connection.query("SELECT id,product,price FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    buyProduct();
  });
});

var purchases = [];
var totalCost = 0.00;

function buyProduct(){
    inquirer.prompt([{
        type: 'input',
        name: 'product_id',
        message: 'Please enter the ID of the product you would like to buy'
    },
    {
        type: 'input',
        name: 'buy_quantity',
        message: 'How many would you like to buy?'
    }
    ]).then(function(data){
        connection.query(
            "SELECT * FROM products WHERE ?",{
                id: data.product_id,
            },function(err,res){
                var buyQuant = data.buy_quantity;
                if(err) throw err;
                // console.log(data,res[0].quantity);
                if(res[0].quantity < buyQuant){
                    console.log('Sorry insufficient quantity :(');
                    buyProduct();
                }else{
                    var newQuant = res[0].quantity -= buyQuant;
                    var name = res[0].product;
                    var cost = res[0].price * buyQuant;
                    if (buyQuant>1){
                        purchases.push(' '+buyQuant+' '+name+"'s");
                    }else{
                        purchases.push(' '+buyQuant+' '+name);
                    }
                    totalCost += cost;
                    var query = connection.query({
                        sql: "UPDATE products SET quantity=?, product_sales=? WHERE id=?",
                        values: [newQuant, cost, data.product_id]
                        },function(err,res){
                            if(err) throw err;
                            // console.log(res);
                            inquirer.prompt([{
                                type: 'confirm',
                                name: 'done_shopping',
                                message: 'Is there anything else you would like to purchase?'
                            }
                            ]).then(function(data){
                                if(data.done_shopping === true){
                                    buyProduct();
                                }else{
                                    console.log('Thank you for your purchase of'+purchases+' for $'+totalCost+'. Have a great day :)');
                                    connection.end();
                                }
                            });
                        }
                    );
                }
            }
        );
    });
}