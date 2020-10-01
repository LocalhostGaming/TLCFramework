const options = {
  weekday: undefined,
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default {
  toDateString(date) {
    return new Date(date).toLocaleDateString('en-US', options);
  },
};
