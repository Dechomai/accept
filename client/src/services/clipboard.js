const clipboard = {
  write(text) {
    if (navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const textArea = document.createElement('textarea');
      try {
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) return resolve();
        return reject();
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }
};

export default clipboard;
