const fs = require('fs');

async function writeDB(item, dbPath = 'db.json') {
  return new Promise((res, rej) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
      if (err) return rej(err);
      const DB = JSON.parse(data);
      const changedDB = JSON.stringify([...DB, item], null, 2);
      fs.writeFile(dbPath, changedDB, 'utf8', (err) => {
        if (err) return rej(err);
        res(true);
      });
    });
  });
}

async function readDB(name = '', dbPath = 'db.json') {
  return new Promise((res, rej) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
      if (err) return rej(err);
      const DB = JSON.parse(data);
      if (!name) return res(DB);
      const existLink = DB.find((el) => el.name === name);
      if (!existLink) return res(false);
      res(existLink);
    });
  });
}

function generateLink(host) {
  const symbols = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
  ];
  const length = symbols.length;

  const firstPart =
    symbols[getRandom(0, length)] + symbols[getRandom(0, length)];
  //
  const secondPart = symbols[getRandom(0, length)];
  //
  const thirdPart = getRandom(0, 10) + '' + getRandom(0, 10);

  const linkName = `${firstPart}${secondPart}${thirdPart}`;

  return {
    nameCreatedLink: linkName,
    hrefCreatedLink: `${host}/${linkName}`,
  };

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

module.exports = { writeDB, readDB, generateLink };
