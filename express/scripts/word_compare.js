function compare(w, good, self) {
  console.log(`comparing ${w} to ${good}`);
  const res = [];
  for(var i = 0; i < w.length; i++) {
    res.push('bad');
  }
  w = w.toLowerCase();
  good = good.toLowerCase();
  for (let id = 0; id < w.length; id++) {
    const letter = good[id];
    for (let j = 0; j < good.length; j++) {
      const id1 = id + j;
      const id2 = id - j;
      if ((w[id1] && w[id1] == letter)) {
        res[id1] = j == 0 ? 'good' : 'mid';
        break;
      } else if ((w[id2] && w[id2] == letter)) {
        res[id2] = j == 0 ? 'good' : 'mid';
        break;
      }
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
