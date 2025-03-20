[&larr; See my other Open Source projects](https://robinvanbaalen.nl)

# @rvanbaalen/readme-to-html
![NPM Downloads](https://img.shields.io/npm/d18m/%40rvanbaalen%2Freadme-to-html)
![GitHub License](https://img.shields.io/github/license/rvanbaalen/readme-to-html)
![NPM Version](https://img.shields.io/npm/v/%40rvanbaalen%2Freadme-to-html)

## Description

A powerful utility that transforms your README.md into a beautifully styled GitHub Pages site. This package automatically converts your markdown documentation into a fully functional HTML page with navigation, syntax highlighting, responsive design, and more.

Perfect for developers who want to create professional project pages without writing HTML/CSS from scratch. Simply customize your template once, and all your projects can have consistent, branded documentation sites.

## Quick Start (5-minute setup)

This package runs via `npx` without installation, perfect for documentation pipelines:

```bash
# 1. Create a config file with pre-made templates
npx @rvanbaalen/readme-to-html --init

# 2. Generate HTML from your README.md
npx @rvanbaalen/readme-to-html

# 3. Preview the result
npx vite preview

# 4. For deployment, build assets
npx vite build
```

That's it! Your README.md is now a beautiful documentation site.

For CI/CD integration, see the GitHub Actions workflow example below.

## Setup and Configuration

You can either use a pre-made template (recommended for most users) or create your own custom template.

### Using Pre-made Templates (Recommended)

The quickest way to get started is to use the `--init` command to generate a configuration file that uses existing templates:

```bash
# Generate a config file with pre-made templates
npx @rvanbaalen/readme-to-html --init
```

This creates an `rtoh.config.js` file with remote templates and stylesheets already configured.

### Custom Templates (Advanced)

If you need more customization, you can create your own template file with these placeholders:

| Placeholder | Description |
|-------------|-------------|
| `{{PAGE_TITLE}}` | Project name from package.json |
| `{{PAGE_DESCRIPTION}}` | Project description from package.json |
| `{{PAGE_PATH}}` | Path for canonical URLs |
| `{{GITHUB_REPO_LINK}}` | GitHub repository URL |
| `{{NAVIGATION_LINKS}}` | Auto-generated from README sections |
| `{{BADGES_SECTION}}` | NPM and GitHub badges | 

For custom stylesheets and section templates, use these special markers:

```html
{{[BEGIN-STYLESHEET]}}
<link href="/css/style.css" rel="stylesheet">
{{[END-STYLESHEET]}}

{{[BEGIN-SECTION]}}
<section id="{{SECTION_ID}}">
  <h2>{{SECTION_TITLE}}</h2>
  <div>{{SECTION_CONTENT}}</div>
</section>
{{[END-SECTION]}}
```

> **Note:** If your template doesn't include stylesheet markers, the tool will automatically inject the stylesheet link before the closing `</head>` tag.

## Command Reference

Run the tool directly using npx (no installation required):

| Command | Description |
|---------|-------------|
| `npx @rvanbaalen/readme-to-html` | Convert README using default settings |
| `npx @rvanbaalen/readme-to-html --init` | Create a minimal configuration file |
| `npx @rvanbaalen/readme-to-html --config=./path/to/config.js` | Use a custom config file |
| `npx @rvanbaalen/readme-to-html --watch` | Watch mode - auto-rebuild when files change |
| `npx @rvanbaalen/readme-to-html --cleanup` | Remove all generated files |
| `npx @rvanbaalen/readme-to-html --help` | Show help information |
| `npx @rvanbaalen/readme-to-html --version` | Show version information |

### Preview and Testing

After generating the HTML, you can preview it with:
```bash
# Preview the generated site
npx vite preview
```

### Cleanup

To remove all generated files:

```bash
# Remove all generated files
npx @rvanbaalen/readme-to-html --cleanup
```

This removes the generated HTML file and build directory, respecting custom paths in your configuration.

## CI/CD Integration

Easily automate documentation generation in CI/CD pipelines with GitHub Actions:

```yaml
on:
  push:
    branches:
      - main

name: Generate and Deploy Documentation

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: 'package.json'
      - run: npx @rvanbaalen/readme-to-html
      - run: npx vite build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

To use this workflow:
1. Create `.github/workflows/docs.yml` with the content above
2. Enable GitHub Pages (Settings > Pages > Source: GitHub Actions)

## Features

- **Automatic Navigation**: Creates a navigation menu from your README.md sections
- **Section-Based Layout**: Organizes content by README.md headings
- **Syntax Highlighting**: Includes Prism.js for beautiful code blocks
- **Responsive Design**: Looks great on all devices
- **SEO-Friendly**: Includes meta tags for better search engine visibility
- **GitHub Integration**: Automatically detects repository information
- **Customizable**: Complete control over HTML/CSS through template.html
- **Configurable**: Support for custom configuration via JavaScript config file
- **Remote Templates**: Can fetch template files from URLs (GitHub, CDNs, etc.)
- **Custom Stylesheets**: Support for local or remote CSS stylesheets
- **Path Customization**: String replacement to fix paths in remote templates
- **Live Development**: Watch mode with automatic rebuilds when files change
- **Easy Cleanup**: Simple command to remove all generated files

## Configuration Options

The configuration file created by `--init` can be customized with these options:

```javascript
export default {
  // Input/Output paths
  readmePath: "README.md",
  templatePath: "src/template.html", // Can be local path or remote URL
  outputPath: "index.html",
  
  // Styling
  stylesheetPath: "src/custom-styles.css", // Can be local path or remote URL
  
  // Navigation customization
  excludeFromNav: ["description", "contributing", "license"],
  
  // Path replacements for remote templates
  replace: {
    "/css/style.css": "./src/style.css" 
  },
  
  // Markdown parsing options (see marked documentation for all options)
  markedOptions: {
    gfm: true,
    highlight: function(code, lang) {
      return `<code class="language-${lang}">${code}</code>`;
    }
  }
}
```

The package uses [marked](https://github.com/markedjs/marked) for markdown parsing and supports TailwindCSS for styling.

## Development Tips

### Live Preview During Development

For comfortable development with live preview:

```json
// In package.json
"scripts": {
  "docs:render": "npx @rvanbaalen/readme-to-html",
  "docs:watch": "npx @rvanbaalen/readme-to-html --watch",
  "docs:preview": "npx vite preview"
}
```

Then run:
```bash
# Watch for changes with live reload
npm run docs:watch
```

### Contributing

Contributions are welcome! Please [open an issue](https://github.com/rvanbaalen/readme-to-html/issues/new) or [submit a pull request](https://github.com/rvanbaalen/readme-to-html/pulls).

## License

MIT License. See the [LICENSE](LICENSE) file for details.
