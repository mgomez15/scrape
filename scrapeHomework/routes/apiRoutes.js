var axios = require("axios");
var cheerio = require("cheerio");
var router = require("express").Router();
var db = require("../models");

router.get("/scrape", function (req, res) {
    axios.get("http://www.nytimes.com").then(function (res) {
        var $ = cheerio.load(res.data)
        var articles = []
        $("article.css-180b3ld").each(function (i, element) {
            var heading = $(this).find("h2").text();
            var url = $(this).find("a").attr("href");
            var summary = $(this).find("p").text();
            var article = {
                heading: heading,
                url: url,
                summary: summary
            }
            db.Article.create(article)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        res.send("scrape complete");
    });
    
});

module.exports = router