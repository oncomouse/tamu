const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');
const R = require('ramda');


glob(path.join(
  __dirname,
  'data',
  '**/*.yml'
), (err, files) => {
  const specializations = [];
  if (err) throw(err);
  files.forEach((file) => {
    var faculty = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    faculty.specializations.forEach((spec) => {
      console.log(spec, R.contains(spec, specializations), specializations.length)
      if (!R.contains(spec, specializations)) {
        specializations.push(spec);
      }
    })
  })
  const output = {
    specializations: R.sort((a,b)=>a-b, specializations)
  }
  fs.writeFile(path.join(
    __dirname,
    'faculty-specializations.yml'
  ), yaml.safeDump(output), (err) => {if(err) throw err});
})
