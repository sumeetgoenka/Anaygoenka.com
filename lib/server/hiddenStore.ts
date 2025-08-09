import fs from 'fs/promises';
import path from 'path';

const baseDir = path.join(process.cwd(), 'lib', 'Games');
const hiddenFile = path.join(baseDir, '_hidden.json');

async function ensureDir() {
  await fs.mkdir(baseDir, { recursive: true });
}

export async function getHiddenIds(): Promise<string[]> {
  try {
    const text = await fs.readFile(hiddenFile, 'utf8');
    const arr = JSON.parse(text);
    if (Array.isArray(arr)) return arr as string[];
    return [];
  } catch {
    return [];
  }
}

export async function hideId(id: string): Promise<void> {
  await ensureDir();
  const current = await getHiddenIds();
  if (!current.includes(id)) current.push(id);
  await fs.writeFile(hiddenFile, JSON.stringify(current, null, 2), 'utf8');
}

export async function unhideId(id: string): Promise<void> {
  await ensureDir();
  const current = await getHiddenIds();
  const next = current.filter((x) => x !== id);
  await fs.writeFile(hiddenFile, JSON.stringify(next, null, 2), 'utf8');
} 