const http = require('http');
const bl = require('bl');

const url = process.argv[2];

http.get(url, (response) => {
  response.pipe(bl((err, data) => {
    if (err) {
      console.error('An error occurred:', err);
      return;
    }

    // Convert the buffer to a string
    const content = data.toString();

    // Output the number of characters received
    console.log(content.length);

    // Output the complete string received
    console.log(content);
  }));
});
