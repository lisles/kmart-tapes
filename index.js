const cheerio = require('cheerio');
const request = require('request');

request({
  method: 'GET',
  url: 'https://archive.org/details/attentionkmartshoppers?and[]=mediatype%3A%22audio%22'
}, (err, res, body) => {

  if (err) return console.error(err);
  let $ = cheerio.load(body);
  let links = [];

  $('a').each(function (i, e) {
      links[i] = $(this).attr('href');
  });

  console.log(links);

})