import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';

// Detect if we have a valid Firebase service account in env
const hasServiceAccount = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

// Initialize Firebase Admin when credentials are available
let firestoreAdmin: any;

if (hasServiceAccount) {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID as string;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL as string;
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY || '';
    const privateKey = rawPrivateKey.includes('\n') ? rawPrivateKey : rawPrivateKey.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }
  firestoreAdmin = admin.firestore();
} else {
  // File-backed fallback for local development (no Firebase Admin credentials)
  const baseDir = path.join(process.cwd(), 'lib', 'Games');
  const gamesIndexFile = path.join(baseDir, '_local_index.json');
  const genericStoreFile = path.join(baseDir, '_generic.json'); // holds assistants and homework

  type GameRecord = {
    id: string;
    slug: string;
    title: string;
    description: string;
    htmlPath: string; // path to HTML file on disk
    createdAt: number;
    updatedAt: number;
    createdBy?: string;
  };

  const ensureDir = async () => {
    await fs.mkdir(baseDir, { recursive: true });
  };

  const readJSON = async (filePath: string): Promise<any> => {
    try {
      const text = await fs.readFile(filePath, 'utf8');
      return JSON.parse(text);
    } catch {
      return {};
    }
  };

  const writeJSON = async (filePath: string, data: any) => {
    await ensureDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  };

  const readGamesIndex = async (): Promise<Record<string, GameRecord>> => {
    return (await readJSON(gamesIndexFile)) as Record<string, GameRecord>;
  };
  const writeGamesIndex = async (map: Record<string, GameRecord>) => writeJSON(gamesIndexFile, map);

  const readGeneric = async (): Promise<{ assistants: Record<string, any>; homework: Record<string, any> }> => {
    const data = (await readJSON(genericStoreFile)) as any;
    return {
      assistants: data.assistants || {},
      homework: data.homework || {},
    };
  };
  const writeGeneric = async (data: { assistants: Record<string, any>; homework: Record<string, any> }) => {
    await writeJSON(genericStoreFile, data);
  };

  const createDocSnapshot = (data: any) => ({
    exists: Boolean(data),
    data: () => data,
  });
  const createQuerySnapshot = (items: any[]) => ({
    docs: items.map((item) => ({ data: () => item })),
  });

  const fileBackedGamesStore = {
    async set(id: string, data: any) {
      await ensureDir();
      const htmlFile = path.join(baseDir, `${id}.html`);
      if (typeof data.html === 'string') {
        await fs.writeFile(htmlFile, data.html, 'utf8');
      }
      const index = await readGamesIndex();
      index[id] = {
        id,
        slug: id,
        title: data.title,
        description: data.description,
        htmlPath: htmlFile,
        createdAt: data.createdAt || Date.now(),
        updatedAt: Date.now(),
        createdBy: data.createdBy,
      };
      await writeGamesIndex(index);
    },
    async get(id: string) {
      const index = await readGamesIndex();
      const meta = index[id];
      if (!meta) return createDocSnapshot(undefined);
      let html = '';
      try { html = await fs.readFile(meta.htmlPath, 'utf8'); } catch {}
      return createDocSnapshot({ ...meta, html });
    },
    async listOrderedByCreatedAtDesc() {
      const index = await readGamesIndex();
      const items = Object.values(index)
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        .map((meta) => ({ id: meta.id, title: meta.title, description: meta.description, slug: meta.slug }));
      return createQuerySnapshot(items);
    },
    async delete(id: string) {
      const index = await readGamesIndex();
      const meta = index[id];
      if (meta && meta.htmlPath) { try { await fs.unlink(meta.htmlPath); } catch {} }
      delete index[id];
      await writeGamesIndex(index);
    },
  };

  const genericStore = {
    async set(collection: 'assistants' | 'homework', id: string, data: any) {
      const current = await readGeneric();
      current[collection][id] = { ...data, id };
      await writeGeneric(current);
    },
    async get(collection: 'assistants' | 'homework', id: string) {
      const current = await readGeneric();
      const item = current[collection][id];
      return createDocSnapshot(item);
    },
    async list(collection: 'assistants' | 'homework', orderField: string) {
      const current = await readGeneric();
      const items = Object.values(current[collection] || {})
        .sort((a: any, b: any) => (b[orderField] || 0) - (a[orderField] || 0));
      return createQuerySnapshot(items);
    },
    async delete(collection: 'assistants' | 'homework', id: string) {
      const current = await readGeneric();
      delete current[collection][id];
      await writeGeneric(current);
    },
  };

  firestoreAdmin = {
    collection(name: string) {
      if (name === 'games') {
        return {
          doc(id: string) {
            return {
              async set(data: any) { await fileBackedGamesStore.set(id, data); },
              async get() { return await fileBackedGamesStore.get(id); },
              async delete() { await fileBackedGamesStore.delete(id); },
            };
          },
          orderBy(_field: string, _direction: 'asc' | 'desc') { return { async get() { return await fileBackedGamesStore.listOrderedByCreatedAtDesc(); } }; },
          async get() { return await fileBackedGamesStore.listOrderedByCreatedAtDesc(); },
        };
      }
      if (name === 'assistants' || name === 'homework') {
        type Col = 'assistants' | 'homework';
        const col = name as Col;
        return {
          doc(id: string) {
            return {
              async set(data: any) { await genericStore.set(col, id, data); },
              async get() { return await genericStore.get(col, id); },
              async delete() { await genericStore.delete(col, id); },
            };
          },
          orderBy(field: string, _direction: 'asc' | 'desc') { return { async get() { return await genericStore.list(col, field); } }; },
          async get() { return await genericStore.list(col, 'createdAt'); },
        };
      }
      throw new Error('Local dev store supports collections: games, assistants, homework');
    },
  } as any;
}

export { firestoreAdmin }; 