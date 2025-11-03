# Smart Bookmark Extension

A Chrome extension that helps you save and organize bookmarks with AI-powered summaries.

## TODO

- [ ] Implement search and filter in bookmarks page
- [ ] Add AI summarization with BYOK (Bring Your Own Key)
- [ ] Export/Sync bookmarks to local system as markdown

# Development

## Tech Stack
- React + TypeScript
- Tailwind 4, shadcn/ui
- Vite + CRXJS
- Vitest

## Prerequisites
- Node.js (v18 or higher recommended)
- Chrome/Chromium browser

## Installation

1. Clone the repository:
```bash
git clone https://github.com/vikrant0017/smart-bookmark-ext
cd smart-bookmark-ext
```

2. Install dependencies:
```bash
npm install
```

Run the extension in development mode with hot module reloading:

```bash
npm run dev
```
> This will create a `dist` folder with the extension files.

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `dist` folder from this project

The extension will now be loaded and you can test it in your browser. Changes will be reflected automatically thanks to HMR.

## Testing

Run tests:

```bash
npm test
```

Run tests with UI:

```bash
npm run test:ui
```

## Extension Permissions

The extension requests the following permissions:
- `sidePanel` - Display content in Chrome's side panel
- `activeTab` - Access the currently active tab
- `storage` - Store bookmarks and settings locally
- `tabs` - Manage browser tabs
- `contextMenus` - Add context menu options

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Extension framework by [CRXJS](https://crxjs.dev/)
