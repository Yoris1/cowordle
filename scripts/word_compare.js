function compare(w, good, self) {
  good = `${good}`.toLowerCase(); // copy string just in case.
  w = w.toLowerCase();

  const res = [];
  for(var i = 0; i < w.length; i++) {
    res.push('bad');
  }

  for (var id = 0; id < w.length; id++) {
    if(w[id] == good[id]) {
      res[id] = 'good';

      var arr = good.split('');
      arr[id] = ';';
      good = arr.join('');
    }
  }
  for (let id = 0; id < w.length; id++) {
    var index = good.indexOf(w[id]);
    if(index >= 0 && good[id] != ';') {
      res[id] = 'mid';

      var arr = good.split('');
      arr[index] = '.';
      good = arr.join('');
    }
  }
  
  if (self === true) {
    for (let i = 0; i < w.length; i++) {
      if (res[i] == 'bad' && !($(`#${w[i]}`).hasClass('keyboard_good'))) { $(`#${w[i]}`).addClass('keyboard_bad'); } else if (res[i] == 'mid') {
        $(`#${w[i]}`).removeClass('keyboard_bad');
      } else if (res[i] == 'good') {
        $(`#${w[i]}`).removeClass('keyboard_bad');
        $(`#${w[i]}`).addClass('keyboard_good');
      }
    }
  }
  return res;
}
