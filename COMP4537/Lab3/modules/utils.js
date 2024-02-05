function getCurrentDateTimeString() {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const month = months[now.getMonth()];
  const day = days[now.getDay()];
  const date = now.getDate();
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const timezoneOffset = now.getTimezoneOffset();
  const timezoneHours = Math.abs(Math.floor(timezoneOffset / 60));
  const timezoneMinutes = Math.abs(timezoneOffset) % 60;
  const timezoneSign = timezoneOffset < 0 ? '+' : '-';

  const timezoneString = `GMT${timezoneSign}${String(timezoneHours).padStart(2, '0')}:${String(timezoneMinutes).padStart(2, '0')}`;

  return `${day} ${month} ${String(date).padStart(2, '0')} ${year} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${timezoneString} (Pacific Standard Time)`;
}

module.exports = { getCurrentDateTimeString };
