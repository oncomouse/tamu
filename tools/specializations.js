const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');
const R = require('ramda');


glob(path.join(
  __dirname,
  '..',
  '_data',
  'faculty',
  '**/*.yml'
), (err, files) => {
  const specializations = [];
  if (err) throw(err);
  files.forEach((file) => {
    var faculty = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    faculty.specializations.forEach((spec) => {
      if (!R.contains(spec, specializations)) {
        specializations.push(spec);
      }
    })
  });
  const output = {
    specializations: R.sort((a,b)=>a-b, specializations)
  };
  fs.writeFile(path.join(
    __dirname,
    '..',
    '_data',
    'faculty-specializations.yml'
  ), yaml.safeDump(output), (err) => {if(err) throw err});
})
