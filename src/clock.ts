export function startTime() {
  const today = new Date();
  let m = today.getMinutes();
  let s = today.getSeconds();
  let ms = today.getMilliseconds();
  m = checkTime(m);
  s = checkTime(s);
  ms = checkMSTime(ms);
  document.getElementById('time').innerHTML = m + ":" + s + ":" + ms;
  setTimeout(startTime, 25);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

function checkMSTime(i) {
  if (i < 100) {i = "0" + i};  // add zero in front of numbers < 100
  return i;
}