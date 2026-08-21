import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { garmentsRouter } from './routes/garments';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/garments', garmentsRouter);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`server listening on :${port}`);
});
