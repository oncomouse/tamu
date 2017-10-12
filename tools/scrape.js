const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const R = require('ramda')

const key = ({family, given}) => `${family.toLowerCase().replace(/\s/,'-')}-${given.toLowerCase().replace(/\s/,'-')}`.replace(/[^a-z0-9\-]/,'');

request('https://english.tamu.edu/directory/faculty/', (error, response, html) => {
  if(error) throw error;
  const $ = cheerio.load(html);
  const facultySites = [];

  $('article td img')
  .each((i, image) => {
    const src = $(image).attr('src');
    const info = $(image).parents('td').next('td').find('a');
    if(info.size === 0) {
      return;
    }
    const url = $(info.first()).attr('href');
    if(!url.match(/^http/) || url.match(/\.jpg$/)) {
      return;
    }
    const name = {
      family: info.first().text().split(', ')[0],
      given: info.first().text().split(', ')[1].replace(/\s*LAAH\s*[0-9]+/i,'')
    };
    const email = info.last().text();
    facultySites.push({
      name,
      email,
      url
    });

    const localname = path.join(
      __dirname,
      '..',
      'public',
      'images',
      'faculty',
      `${key(name)}${path.extname(src)}`
    );
    fs.exists(localname, (exists) => {
      if(!exists) {
        const r = request(src).pipe(fs.createWriteStream(localname));
        r.on('close', ()=>{});
      }
    })
  })
  facultySites.forEach(({url,email,name}) => {
    request(url, (error, response, html) => {
      const $ = cheerio.load(html);
      const filePath = path.join(
        __dirname,
        '..',
        '_data',
        'faculty',
        `${key(name)}.yml`
      );
      const output = {
        name,
        email,
        url,
        specializations: $('h4').filter((i,x) => $(x).text().match(/(specialization|research interests)/i)).eq(0).next('ul').find('li').map((i,li) => R.trim($(li).text())).toArray()
      };
      fs.exists(filePath, (exists) => {
        if(!exists) {
          fs.writeFile(filePath, yaml.safeDump(output), (error) => {
            if(error) throw error;
          })
        }
      })
    })
  })
});
