import http from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');

const PORT = process.env.PORT || 3000;
const uploads = new Map();

const ensureUploadsDir = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
};

const send = (res, status, body, headers = {}) => {
  res.writeHead(status, headers);
  res.end(body);
};

const sendText = (res, status, text) => {
  send(res, status, text, { 'Content-Type': 'text/plain; charset=utf-8' });
};

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const notFound = (res) => {
  sendText(res, 404, 'Not Found');
};

const collectBuffer = (req) =>
  new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
  });

const extractMultipartFile = (buffer, boundary) => {
  const boundaryText = `--${boundary}`;
  const bodyText = buffer.toString('latin1');
  const parts = bodyText
    .split(boundaryText)
    .filter((part) => part.includes('Content-Disposition'));

  if (parts.length === 0) {
    return null;
  }

  const partText = parts[0];
  const headerEndIndex = partText.indexOf('\r\n\r\n');
  if (headerEndIndex === -1) {
    return null;
  }

  const fileStart = headerEndIndex + 4;
  const fileEnd = partText.lastIndexOf('\r\n');
  if (fileEnd <= fileStart) {
    return null;
  }

  const fileText = partText.slice(fileStart, fileEnd);
  return Buffer.from(fileText, 'latin1');
};

const handleProcess = async (req, res) => {
  await ensureUploadsDir();

  const contentType = req.headers['content-type'] || '';
  const boundaryMatch = contentType.match(/boundary=(.+)$/);
  const boundary = boundaryMatch ? boundaryMatch[1] : null;
  const body = await collectBuffer(req);

  const fileBuffer = boundary ? extractMultipartFile(body, boundary) : null;
  if (!fileBuffer) {
    sendText(res, 400, 'No file received');
    return;
  }

  const id = crypto.randomUUID();
  const filePath = path.join(uploadsDir, `${id}.bin`);
  await fs.writeFile(filePath, fileBuffer);
  uploads.set(id, filePath);

  sendText(res, 200, id);
};

const handleRevert = async (req, res) => {
  const body = await collectBuffer(req);
  const id = body.toString('utf8').trim();

  if (!id) {
    sendText(res, 400, 'Missing file id');
    return;
  }

  const filePath = uploads.get(id);
  if (filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // noop
    }
    uploads.delete(id);
  }

  sendText(res, 200, 'OK');
};

const handleLoad = async (req, res, pathname) => {
  const id = pathname.replace('/load/', '').trim();
  if (!id) {
    sendText(res, 400, 'Missing file id');
    return;
  }

  const filePath = uploads.get(id);
  if (!filePath) {
    sendText(res, 404, 'Not Found');
    return;
  }

  try {
    const data = await fs.readFile(filePath);
    send(res, 200, data, { 'Content-Type': 'application/octet-stream' });
  } catch (error) {
    sendText(res, 500, 'Failed to load file');
  }
};

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  const parsedUrl = new URL(url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  setCors(res);

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (method === 'POST' && pathname === '/process') {
    await handleProcess(req, res);
    return;
  }

  if (method === 'DELETE' && pathname === '/revert') {
    await handleRevert(req, res);
    return;
  }

  if (method === 'GET' && pathname.startsWith('/load/')) {
    await handleLoad(req, res, pathname);
    return;
  }

  notFound(res);
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Demo server running at http://localhost:${PORT}`);
});
