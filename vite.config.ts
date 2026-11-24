import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(import.meta.dirname, 'dist');
          const srcAssets = path.resolve(import.meta.dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
      // Bundles compiled CSS and JS directly into dist/index.html so it can be
      // embedded as a single self-contained HTML file (Google Sites, GitHub Pages, local file).
      {
        name: 'inline-singlefile-html',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(import.meta.dirname, 'dist');
          const indexHtmlPath = path.join(distDir, 'index.html');
          if (!fs.existsSync(indexHtmlPath)) {
            return;
          }

          let html = fs.readFileSync(indexHtmlPath, 'utf-8');

          // Inline all compiled stylesheets in <head>
          html = html.replace(
            /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
            (fullTag, href: string) => {
              const relPath = href.replace(/^\.?\//, '');
              const cssPath = path.join(distDir, relPath);
              if (!fs.existsSync(cssPath)) return fullTag;
              const cssContent = fs.readFileSync(cssPath, 'utf-8');
              fs.unlinkSync(cssPath);
              return `<style>${cssContent}</style>`;
            }
          );

          // Extract compiled module scripts and place them right before </body>
          // after <div id="root"></div> is parsed.
          const inlinedScripts: string[] = [];
          html = html.replace(
            /<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+)["'][^>]*><\/script>/gi,
            (fullTag, src: string) => {
              const relPath = src.replace(/^\.?\//, '');
              const jsPath = path.join(distDir, relPath);
              if (!fs.existsSync(jsPath)) return fullTag;
              const jsContent = fs
                .readFileSync(jsPath, 'utf-8')
                .replace(/<\/script/gi, '<\\/script');
              fs.unlinkSync(jsPath);
              inlinedScripts.push(`<script type="module">${jsContent}</script>`);
              return '';
            }
          );

          if (inlinedScripts.length > 0) {
            html = html.replace(/<\/body>/i, () => `${inlinedScripts.join('\n')}\n  </body>`);
          }

          fs.writeFileSync(indexHtmlPath, html, 'utf-8');
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
