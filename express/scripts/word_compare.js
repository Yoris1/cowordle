function compare(w, good, self) {
  const res = ['N', 'N', 'N', 'N', 'N'];
  w = w.toLowerCase();
  good = good.toLowerCase();
  for (let id = 0; id < w.length; id++) {
    const letter = good[id];
    for (let j = 0; j < w.length; j++) {
      const id1 = id + j;
      const id2 = id - j;
      if ((w[id1] && w[id1] == letter)) {
        res[id1] = j == 0 ? 'Y' : 'M';
        break;
      } else if ((w[id2] && w[id2] == letter)) {
        res[id2] = j == 0 ? 'Y' : 'M';
        break;
      }
    }
  }
  if (self === true) {
    for (let i = 0; i < w.length; i++) {
      if (res[i] == 'N' && !($(`#${w[i]}`).hasClass('keyboard_good'))) { $(`#${w[i]}`).addClass('keyboard_bad'); } else if (res[i] == 'M') {
        $(`#${w[i]}`).removeClass('keyboard_bad');
      } else if (res[i] == 'Y') {
        $(`#${w[i]}`).removeClass('keyboard_bad');
        $(`#${w[i]}`).addClass('keyboard_good');
      }
    }
  }
  return res;
}
