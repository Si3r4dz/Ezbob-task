import express, { Request, Response } from 'express';
import cors from 'cors';
import { fakeDB } from './db';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET /api/search?query=something&page=1&pageSize=10
app.get('/api/search', (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;

  const lowerQuery = query.toLowerCase();
  const filtered = fakeDB.filter((item) =>
    item.title.toLowerCase().includes(lowerQuery)
  );

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = filtered.slice(startIndex, endIndex);

  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  res.json({
    page,
    pageSize,
    totalResults,
    totalPages,
    results: paginated,
    query,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
