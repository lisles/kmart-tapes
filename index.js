const cheerio = require('cheerio');
const got = require('got');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

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

        // get and downlaod the mp3 in the resulting page
        const thisResponse = await got(thisURL);
        let pageCheerio = cheerio.load(thisResponse.body);

        // look for div.format.group divs
        let pageContents = pageCheerio('div.format-group').contents();

        // get mp3 hrefs
        for (let ii = 0; ii < pageContents.length; ii++) {
          if (pageContents[ii].type === 'tag' 
              && pageContents[ii].name === 'a'
              && pageContents[ii].attribs.href.includes('mp3')) {

            // prep url and filename
            let downloadLink = 'https://archive.org' + pageContents[ii].attribs.href;
            let fileName = decodeURI(path.parse(downloadLink).base);

            // download the file, await for each download to complete 
            console.log('downloading', downloadLink)
            const pipeline = promisify(stream.pipeline);
            const downloadStream = got.stream(downloadLink);
            const fileWriterStream = fs.createWriteStream('./mp3'+fileName);

            downloadStream.on("downloadProgress", ({ transferred, total, percent }) => {
              const percentage = Math.round(percent * 100);
              console.error(`progress: ${transferred}/${total} (${percentage}%)`);
            });

            await pipeline(downloadStream, fileWriterStream)
              .then(() => console.log(`File downloaded to ${fileName}`))
              .catch((error) => console.error(`Something went wrong. ${error.message}`));
          }
        }
      }
    }

  }
  catch (error) {
      console.log(error.response.body);
  }
})();