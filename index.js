const cheerio = require('cheerio');
const got = require('got');
const path = require('path');
const { createWriteStream } = require('fs');

(async () => {
  try {
    // get the index of kmart tapes
    const indexResponse = await got('https://archive.org/details/attentionkmartshoppers');
    let $ = cheerio.load(indexResponse.body);
    
    // look for all classes partially names 'item-ttl' and get the hrefs
    // add them to an array of links, we'll go through all of these next
    let contents = $('[class~="item-ttl"]').contents();
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].type === 'tag' && contents[i].name === 'a') {
        let thisURL = 'https://archive.org' + contents[i].attribs.href;

        // scrape this resulting page for the mp3 and download it
        const thisResponse = await got(thisURL);
        let pageCheerio = cheerio.load(thisResponse.body);
        let pageContents = pageCheerio('div.format-group').contents();

        for (let ii = 0; ii < pageContents.length; ii++) {
          if (pageContents[ii].type === 'tag' 
              && pageContents[ii].name === 'a'
              && pageContents[ii].attribs.href.includes('mp3')) {

            let downloadLink = 'https://archive.org' + pageContents[ii].attribs.href;
            let fileName = decodeURI(path.parse(downloadLink).base);
            console.log('downloading', downloadLink)
                
            got.stream(downloadLink).pipe(createWriteStream('./mp3/'+fileName));
          }
        }
      }
    }

  }
  catch (error) {
      console.log(error.response.body);
  }
})();