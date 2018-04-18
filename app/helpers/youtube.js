module.exports.getVideoId = function(url) {
  if (typeof url !== 'string' || url === '') return null;

  const pattern = /(?:youtu\.be\/|youtube\.com\/watch\?(?:.*&)?v=|(?:embed|v)\/)([^\\?&"'>]+)/;
  const [, id] = url.trim('/').match(pattern);

  return id;
};
