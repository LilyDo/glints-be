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

// GET candidate name, age method route
app.get('/candidate/:id', async (req, res) => {
  const dbRes = await client.query(
    'SELECT id, name, age from candidate where id = $1',
    [req.params.id],
  );

  res.send({ data: dbRes.rows[0] || {}, status: 'success' });
});

app.listen(port);
console.log(`app listening on ${port}`);
