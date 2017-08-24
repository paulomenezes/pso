const fs = require('fs');

fs.readFile('./german.data-numeric.txt', (err, data) => {
  data = data.toString().split('\n');

  let bigger = 0;
  let array = [];
  data.forEach(line => {
    let lineArray = [];
    line.split(' ').forEach(value => {
      if (parseInt(value)) {
        if (value > bigger) {
          bigger = value;
        }

        lineArray.push(parseInt(value));
      }
    });

    array.push(lineArray);
  });

  let count = 0;
  let total = data.length;

  let training = '';
  let test = '';
  array.forEach(line => {
    if (line.length > 10) {
      const category = line.pop();

      let lineNormalized = [];
      line.forEach(value => {
        lineNormalized.push(value / bigger);
      });

      if (count < total * 0.7) {
        training += `${lineNormalized},${category}\n`;
        count++;
      } else {
        test += `${lineNormalized},${category}\n`;
      }
    }
  });

  fs.writeFile('./german.training.txt', training, () => {});
  fs.writeFile('./german.test.txt', test, () => {});
});
