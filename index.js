const express = require("express");
var path = require("path");

function parseMySQLDate(mysqlDate) {
  // Split the MySQL date string into date and time parts
  const [datePart, timePart] = mysqlDate.split(" ");

  // Split the date part into year, month, and day
  const [year, month, day] = datePart.split("-").map(Number);

  // Split the time part into hours, minutes, and seconds
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Create a new Date object with the extracted components
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

const app = express();
const port = 3000;
const axios = require("axios");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
});
app.get("/script.js", (req, res) => {
  res.sendFile(path.join(__dirname, "script.js"));
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  port:3306,
  user: "root",
  password: "password",
  database: "twitterclone",
});

app.get("/api/returnstuff",function(req,res){
  res.send("this is something");
})

app.get("/api/allposts", function (req, res) {
  connection.query(
    "SELECT users.username, posts.*  FROM posts join users on users.id = posts.userid order by id desc limit 50",
    function (err, data) {
      if (err) throw err;
      res.json(data);
    }
  );
});

app.post("/api/post", function (req, res) {
console.log(req.body)
  connection.query(
    "INSERT INTO posts (userid,postbody) values(?,?)",
    [req.body.userid, req.body.text],
    function (err, data) {
      if (err) throw err;
      res.json(data);
    }
  );
});

app.post("/api/editPost/:id", function (req, res) {
  var id = req.params.id;
  console.log(req.body)
  console.log(id)
  connection.query(
    "UPDATE posts set postbody = ? WHERE id = ?",
    [req.body.text, parseInt(id)],
    function (err, data) {
      if (err) throw err;
      res.json(data);
    }
  );
});

// connection.query(
//   "SELECT * FROM posts order by id desc limit 50",
//   function (err, result) {
//     if (err) throw err;
//     console.log(result)
//   }
// );


// axios.get("/api/allposts").then(function(response){
//     console.log(JSON.stringify(response));
// });

// fetch("https://jsonplaceholder.typicode.com/posts", {
//   method: "POST",
//   body: JSON.stringify({
//     title: "foo",
//     body: "bar",
//     userId: 1,
//   }),
//   headers: {
//     "Content-type": "application/json; charset=UTF-8",
//   },
// })
//   .then((res) => res.json())
//   .then(console.log);