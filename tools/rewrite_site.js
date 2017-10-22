(
  function($) {
    var output = $('<div/>');
    $('article td img').each(function (i, image) {
      var cell = $(image).parents('td');
      var nextCell = cell.next('td');
      var info = nextCell.text().split(/\s*\n/).map(function(x) { return x.replace(/^\s+/,''); });
      var link = nextCell.find('a').eq(0).attr('href');
      var myOutput = $('<div style="display: inline-block; width: 240px; padding-right: 15px; min-height: 330px"/>');
      var name = link === null ? info[0] : '<a href="'+link+'">' + info[0] + '</a>';
      myOutput.append($(image));
      if(info.length === 4) {
        myOutput.append($('<p><span class="name" style="display:block">'+name+'</span><span class="office" style="display:block">' + info[1] + '</span><span class="phone" style="display:block">' + info[2] + '</span><span class="email" style="display:block"><a href="mailto: ' + info[3] + '">' + info[3] + '</a></span></p>'))
      } else {
        myOutput.append($('<p><span class="name" style="display:block">'+name+'</span><span class="office" style="display:block">' + info[1] + '</span><span class="email" style="display:block"><a href="mailto: ' + info[2] + '">' + info[2] + '</a></span><br></p>'));
      }
      output.append(myOutput);
    });
    $('article table').remove();
    $('article h4:eq(0)').after(output);
  }
)(jQuery)


// Flex

(function($) {
  var output = $('<div style="display: flex; flex-flow: row wrap; max-width: 900px; margin: auto;"/>');
  $('article td img').each(function (i, image) {
    var cell = $(image).parents('td');
    var nextCell = cell.next('td');
    var info = nextCell.text().split(/\s*\n/).map(function(x) { return x.replace(/^\s+/,''); });
    var link = nextCell.find('a').eq(0).attr('href');
    var faculty = {};
    faculty.name = info[0];
    faculty.office = info[1];
    if (info.length >= 4) {
      faculty.phone = info[2];
      faculty.email = info[3];
    } else if(info.length === 3) {
      faculty.email = info[2];
    }
    var myOutput = $('<div style="margin: auto; min-width: 225px; padding-left: 7px; padding-right: 7px; min-height: 330px"/>');
    myOutput.append($(image));
    var outputParagraph = $('<p style="padding-left: 15px"/>');
    outputParagraph.append($(
      '<span class="name" style="display: block">' + (link === null ? faculty.name : '<a href="'+link+'">'+faculty.name+'</a>') + '</span>'
    ));
    outputParagraph.append($(
      '<span class="office" style="display:block">' + faculty.office + '</span>'
    ));
    outputParagraph.append($(
      (faculty.phone === undefined ? '' : '<span class="phone" style="display:block">' + faculty.phone + '</span>')
    ));
    outputParagraph.append($(
      '<span class="email" style="display:block"><a href="mailto: '+faculty.email+'">' + faculty.email + '</a></span>' + (faculty.phone === undefined ? '<br>' : '')
    ))
    myOutput.append($(outputParagraph));
    output.append(myOutput);
  });
  $('article table').remove();
  $('article h4:eq(0)').after(output);
})(jQuery)
