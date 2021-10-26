const express = require('express');
const app = express();
const path = require('path');
const { readDB, writeDB, generateLink } = require('./utils');
const PORT = 322;
const STATIC = path.resolve(__dirname + '/public');

app.use(express.static(STATIC));
app.use(express.json());

app.get('/', (req, res) => {
  const htmlPath = STATIC + '/index.html';
  res.sendFile(htmlPath);
});
// ПАРСИНГ ССЫЛКИ
app.get('/:link', async (req, res) => {
  const { link } = req.params;
  try {
    const existLink = await readDB(link);
    if (!existLink) return res.status(400).sendFile(STATIC + '/error.html');
    res.redirect(existLink.href);
  } catch (err) {
    console.error(err);
  }
});
// СОЗДАНИЕ ССЫЛКИ
app.post('/link', async (req, res) => {
  const { href } = req.body;
  const host = req.headers.origin;
  try {
    const data = await createLink();
    async function createLink() {
      const { nameCreatedLink, hrefCreatedLink } = generateLink(host);
      try {
        const existLink = await readDB(nameCreatedLink);
        if (existLink) {
          return await createLink();
        }
        const obj = {
          id: Date.now(),
          name: nameCreatedLink,
          href,
          hrefShort: hrefCreatedLink,
        };
        const createdLink = await writeDB(obj);
        if (createdLink) {
          return obj;
        }
      } catch (err) {
        throw err;
      }
    }
    res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, data: err });
  }
});

app.listen(PORT, () => {
  console.log('start ' + PORT);
});
