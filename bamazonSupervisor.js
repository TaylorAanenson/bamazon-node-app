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

connection.connect(function connecter(err) {
  if (err) throw err;
  inquirer.prompt([{
    type: 'password',
    name: 'pass',
    message: 'Please enter password'
    }
    ]).then(function(data){
        if(data.pass === 'bs'){
            var timer = setInterval(initializer,1000);
            console.log("Initializing interface.. ");
            function initializer(){
                clearInterval(timer);
                console.log("Welcome. Connected as id "+connection.threadId);
                superviseDepartments();
            }
        }else{
            console.log('Incorrect! Try again..');
            connecter();
        }
    });

});

function superviseDepartments(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        choices: ['View Product Sales by Department', 'Create New Department', 'Exit']
    }
    ]).then(function(data){
        if(data.action === 'View Product Sales by Department'){
            connection.query("SELECT departments.department_id, department_name, over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales)-over_head_costs) AS total_profits FROM departments LEFT JOIN products ON products.department_id = departments.department_id GROUP BY department_name", function(err, res) {
                if (err) throw err;
                // for (i in res){
                    // var prof = parseFloat(res[i].over_head_costs)-parseFloat(res[i].product_sales);
                    // console.log(parseFloat(res[i].over_head_costs)-parseFloat(res[i].product_sales));
                    console.table(res);
                // }
                superviseDepartments();
                });
        }else if(data.action === 'Create New Department'){
            addDepartment();
            function addDepartment(){
                inquirer.prompt([{
                    type: 'input',
                    name: 'department_id',
                    message: "What is the department's id number?"
                },
                {
                    type: 'input',
                    name: 'department_name',
                    message: 'What is the name of the deparment?'
                },
                {
                    type: 'input',
                    name: 'over_head_costs',
                    message: 'What are the over head costs?'
                }
                ]).then(function(data){
                    var id = data.department_id;
                    var name = data.department_name;
                    var overHead = parseFloat(data.over_head_costs);
                    inquirer.prompt([{
                        type: 'confirm',
                        name: 'action',
                        message: 'Is everything correct?'
                    }
                    ]).then(function (data){
                        if(data.action === true){
                            connection.query({
                                sql: "INSERT INTO departments (department_id,department_name,over_head_costs) VALUES (?,?,?)",
                                values: [id,name,overHead],
                                },function(err,res){
                                    if(err) throw err;
                                    console.log('Department inserted successfully');
                                    superviseDepartments();
                                });
                        }else{
                            addDepartment();
                        }
                    });
                });
            }
        }else if(data.action === 'Exit'){
            connection.end();
        }
    });
}