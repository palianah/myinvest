export default {
  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
  },
}
