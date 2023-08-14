export function getDateOffsetUTC(hours) {
    const currentDateUTC = new Date();
    const timezoneOffset = hours * 60;
    return new Date(currentDateUTC.getTime() + timezoneOffset * 60000);
  }