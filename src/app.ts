import express from 'express';
import { Client } from 'pg';

const app = express();
const port = 3001;
app.use(express.json());

const client = new Client({
  host: 'localhost',
  database: 'glints',
  username: 'postgres',
});

async function connect() {
  await client.connect();
}

connect();

// GET candidate details
app.get('/candidate/:id', async (req, res) => {
  const dbRes = await client.query(
    'SELECT id, name, age, profile_image_url from candidate where id = $1',
    [req.params.id],
  );

  res.send({ data: dbRes.rows[0] || {}, status: 'success' });
});

// create candidate details
app.post('/candidate', async (req, res) => {
  const { name, age, profile_image_url } = req.body;
  if (
    name === undefined ||
    age === undefined ||
    profile_image_url === undefined
  ) {
    res
      .status(400)
      .send('name, age, profile_image_url, is_private & id are all required');
    return;
  }
  try {
    const dbRes = await client.query(
      'INSERT INTO candidate(name, age, profile_image_url, is_private) VALUES ($1, $2, $3, $4)',
      [name, age, profile_image_url, false],
    );
    res.send({ data: `${dbRes.rowCount} row(s) created`, status: 'success' });
  } catch (e) {
    if (e) console.error(e);
    res.status(500).send({ data: { message: e?.toString() }, status: 'error' });
  }
});

// update candidate details
app.post('/candidate/:id', async (req, res) => {
  const { name, age, profile_image_url, is_private } = req.body;
  const { id } = req.params;
  if (
    name === undefined ||
    age === undefined ||
    profile_image_url === undefined ||
    is_private === undefined
  ) {
    res
      .status(400)
      .send('name, age, profile_image_url, is_private & id are all required');
    return;
  }

  try {
    const dbRes = await client.query(
      'UPDATE candidate set name = $1, age = $2, profile_image_url = $3, is_private = $4 where id = $5',
      [name, age, profile_image_url, is_private, id],
    );
    res.send({
      data: `${dbRes.rowCount} row(s) updated`,
      status: 'success',
    });
  } catch (e) {
    if (e) console.error(e);
    res.status(500).send({ data: { message: e?.toString() }, status: 'error' });
  }
});

app.listen(port);
console.log(`app listening on ${port}`);
