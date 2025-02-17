# Vue Project Visualizer

Vue Project Visualizer is a web tool that generates interactive visualizations for Vue.js, Nuxt.js, and Astro+Vue repositories. It provides insights into the file structure, dependencies, and relationships within your repository, helping developers better understand their project's architecture.

[![GitHub Repo stars](https://img.shields.io/github/stars/vuejsco/vue-project-visualizer?style=for-the-badge&logo=github)](https://github.com/vuejsco/vue-project-visualizer)
[![GitHub license](https://img.shields.io/github/license/vuejsco/vue-project-visualizer?style=for-the-badge&logo=github)](https://github.com/vuejsco/vue-project-visualizer/blob/main/LICENSE)

## Features

- **Repository Analysis**: Validate Vue-based projects automatically.
- **File Structure Visualization**: Interactive graph representation of the project hierarchy.
- **File Type Filtering**: Highlight only relevant code files.
- **Error Handling**: Clear messages for invalid URLs, rate limits, and non-Vue repositories.
- **No External API Requirements**: Works without GitHub authentication tokens.

## Tech Stack

- **Vue 3**: Progressive JavaScript framework.
- **TypeScript**: For type safety and maintainability.
- **Pinia**: State management.
- **Vue Router**: Client-side navigation.
- **D3.js**: Interactive visualization library.
- **Tailwind CSS**: Utility-first CSS framework.

## Project Structure

```textplain
src/
├── App.vue
├── assets/
|  └── vue.svg
├── components/
|  └── GraphVisualization.vue
├── main.ts
├── style.css
├── types/
|  └── index.ts
├── utils/
|  ├── fileUtils.ts
|  └── github.ts
└── vite-env.d.ts
```

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/vue-project-visualizer.git
   ```

2. Install dependencies:

   ```bash
   cd vue-project-visualizer
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## Features Breakdown

### Repository Analysis

- Validate Vue, Nuxt, and Astro+Vue projects.
- Uses package.json and file structure for verification.

### File Structure Visualization

- Uses D3.js for dynamic rendering.
- Provides an interactive force-directed graph.
- Zoom and pan functionality for navigation.

### Error Handling

- Detects and displays errors for:
  - Invalid repository URLs.
  - Non-Vue repositories.
  - GitHub API rate limits.
  - Network issues.

## Contributing

We welcome community contributions! To get started:

1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

For guidelines, refer to the [Contribution Guide](./CONTRIBUTING.md).

## License

This project is licensed under the MIT License. See the [MIT License](https://opensource.org/licenses/MIT) for details.
