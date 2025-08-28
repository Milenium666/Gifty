#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = path.join(root, 'dist', 'gift-helper', 'browser');

function fail(msg) {
  console.error(`❌ Validate failed: ${msg}`);
  process.exit(1);
}

if (!fs.existsSync(outDir)) fail(`Output dir not found: ${outDir}`);

const indexHtml = path.join(outDir, 'index.html');
if (!fs.existsSync(indexHtml)) fail('index.html not found');

const files = fs.readdirSync(outDir);
const hasMain = files.some((f) => /^main-.*\.js$/.test(f));
if (!hasMain) fail('main-*.js not found');

console.log('✅ Validate passed');

