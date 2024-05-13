const fs = require('fs');

const filePath = process.argv[2]; // The path to the file is the first command-line argument

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }

  const numNewlines = data.split('\n').length - 1;
  console.log(numNewlines);
});
