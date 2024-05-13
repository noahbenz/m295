
const fs = require('fs');

const filePath = process.argv[2];

const fileContents = fs.readFileSync(filePath);

const newlineCount = fileContents.toString().split('\n').length - 1;

console.log(newlineCount);
