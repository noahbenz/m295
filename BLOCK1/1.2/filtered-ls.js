const fs = require('fs');
const path = require('path');

const directory = process.argv[2]; // Directory name is the first command-line argument
const extension = `.${process.argv[3]}`; // File extension is the second command-line argument

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error('An error occurred:', err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === extension) {
      console.log(file);
    }
  });
});
