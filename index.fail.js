const got = require('got');
const parse5 = require('parse5');

(async () => {
    try {
      // const response = await got('https://sindresorhus.com');
      const response = await got('https://archive.org/details/attentionkmartshoppers');
      const document = parse5.parse(response.body);
      const childNodes = document.childNodes[1].childNodes;
      const html = childNodes.filter( (el) => {
        return el.nodeName == 'body' &&
                el.tagName == 'body'
      }); 
      const htmlChildren = html[0]['childNodes']
      console.log(htmlChildren);
      const divs = htmlChildren.filter( (el) => {
        return el.nodeName == 'div' && el.tagName == 'div'
      })
      // console.log(divs[0])
      const divsChildren = divs[0]['childNodes']
      // console.log(divsChildren)


    }

    catch (error) {
        console.log(error.response.body);
    }
})();