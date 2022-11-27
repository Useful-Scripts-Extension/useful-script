// https://stackoverflow.com/a/858638

window.originalSetTimeout = window.setTimeout;
window.originalClearTimeout = window.clearTimeout;

const useful_scripts_track_settimeout = {
  currentId: 0,
  activeTimers: [],
};

window.setTimeout = function (func, delay) {
  useful_scripts_track_settimeout.activeTimers.push({
    id: useful_scripts_track_settimeout.currentId++,
    func: func,
    funcStr: func.toString(),
  });
  return window.originalSetTimeout(func, delay);
};

window.clearTimeout = function (timerID) {
  useful_scripts_track_settimeout.activeTimers =
    useful_scripts_track_settimeout.activeTimers.filter(
      (_) => _.id !== useful_scripts_track_settimeout.currentId
    );
  useful_scripts_track_settimeout.currentId--;
  window.originalClearTimeout(timerID);
};
