const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require('express-handlebars');
const logger = require("morgan");
const PORT = process.env.PORT || 3000

var app = express();
var db =  require("./models");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/scrape", function(res) {

axios.get("https://www.buzzfeednews.com/").then(function(response) {
    
var $ = cheerio.load(response.data);

var results = [];

//this is for title and link 
$(".newsblock-story-card_info xs-prl").each(function(i, element) {
  var title = $(element).children("h2").text();
  var link = $(element).children("a").attr("href");
  var summary= $(element).children("p")
  var author = $(element).children("newsblock-story-card_byline").
  
  results.push({
    title: title,
    link: link,
    summary:summary,
    author:author

  });

//this is for the picture. The img is in its own main class. 
  $(".newsblock-story-card_image-link img-wireframe img-wireframe--dblbig").each(function(i, element) {
    var imgLink = $(element).find("a").find("img").attr("src").split(",")[0].split(" ")[0];
    results.push({ link: imgLink });
  });

  db.Article.create(result)
.then(function(dbArticle) {
 // i tried console.log but its still coming back blank 
  console.log(dbArticle);
})
.catch(function(err) {
  // If an error occurred, log it
  console.log(err);
});
res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
 
  db.Article.find({})
    .then(function(dbArticle) {
    
      res.json(dbArticle);
    })
    .catch(function(err) {
     
      res.json(err);
    });
});


console.log(results);
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log('MongoDB Scrapper listening on Port ' + PORT)
})})});
