import fs from 'fs/promises';
import path from 'path';

export default function navUpdatePlugin() {
  return {
    name: 'vite-plugin-nav-update',
    async transformIndexHtml(html, ctx) {
      // pages/ ディレクトリのHTMLファイルを取得
      const pagesDir = path.resolve(process.cwd(), 'pages');
      let files;
      try {
        files = await fs.readdir(pagesDir);
      } catch (e) {
        console.error('Error reading pages directory:', e);
        return html; // エラー時は元のHTMLを返す
      }
      const htmlFiles = files.filter(file => file.endsWith('.html'));

      // ナビゲーションリンクを生成
      const navLinks = htmlFiles
        .map(file => {
          const name = path.basename(file, '.html');
          return `<li><a href="/pages/${file}" class="text-blue-500 underline">${name.charAt(0).toUpperCase() + name.slice(1)}</a></li>`;
        })
        .join('\n');

      // <nav> 内の <ul> を置換
      const updatedHtml = html.replace(
        /<ul class="space-y-2">[\s\S]*<\/ul>/,
        `<ul class="space-y-2">\n${navLinks}\n</ul>`
      );

      return updatedHtml;
    },
    handleHotUpdate({ file, server }) {
      // pages/ ディレクトリのファイル変更を監視
      if (file.startsWith(path.resolve(process.cwd(), 'pages')) && file.endsWith('.html')) {
        server.ws.send({ type: 'full-reload' }); // ページをリロード
      }
    }
  };
}