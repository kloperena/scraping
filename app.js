$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + data[i].author + data[i].link + "</p>");
    }
  });
  
const Article = require('../models/Article');
const Note = require('../models/Note.js');

app.get('/', (req, res) => {
    res.redirect('/scrape')
});

app.get('/scrape', (req, res) => {
    const scrapedUrl = 'https://www.buzzfeednews.com/'

    request(scrapedUrl, (err, res, html) => {

        // checks for errors
        if (e) throw e;

        const $ = cheerio.load(html);

        $('newsblock-story-card_info xs-prl').each((i, element) => {
            const res = $(element)

            const title = res.find('h2').text()
            const summary = res.find('p').text()
            const link = res.find('a').attr('href');
            const author = res.find('.newsblock-story-card_byline').text()

            if (title && body && url && author) {
                var result = {}

                result.title = title;
                result.summary = summary;
                result.link = link;
                result.author = author;

                Article.create(result, (err, data) => {
                    if (e) throw e;
                    console.log(data)
                });
            }
        });
    });
    res.redirect('/')
});

app.get('/newsfeed', (req, res) => {
    Article.find({}, (e, data) => {
        if (e) throw e
        res.render('index', { result: data });
    })
})

app.post('/newsfeed/:id', (req, res) => {
    Note.create(req.body, (e, data) => {
        if (e) throw e;
        Article.findOneAndUpdate(
            {
                '_id': req.params.id
            },
            {
            
                $push: {
                    'note': data._id
                }
            })

    })
});