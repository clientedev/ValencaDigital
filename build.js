import { build } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

async function buildClient() {
  console.log('Building client...');
  
  await build({
    root: resolve(__dirname, 'client'),
    build: {
      outDir: resolve(__dirname, 'client/dist'),
      emptyOutDir: true
    }
  });
  
  console.log('Client build completed!');
}

buildClient().catch(console.error);