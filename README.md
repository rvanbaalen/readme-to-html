[&larr; See my other Open Source projects](https://robinvanbaalen.nl)

# @rvanbaalen/readme-to-html
![NPM Downloads](https://img.shields.io/npm/d18m/%40rvanbaalen%2Freadme-to-html)
![GitHub License](https://img.shields.io/github/license/rvanbaalen/readme-to-html)
![NPM Version](https://img.shields.io/npm/v/%40rvanbaalen%2Freadme-to-html)

## Description

A powerful utility that transforms your README.md into a beautifully styled GitHub Pages site. This package automatically converts your markdown documentation into a fully functional HTML page with navigation, syntax highlighting, responsive design, and more.

Perfect for developers who want to create professional project pages without writing HTML/CSS from scratch. Simply customize your template once, and all your projects can have consistent, branded documentation sites.

## Installation

Install the package via npm:

```bash
npm install @rvanbaalen/readme-to-html
```

## Usage

### 1. Create a Template File

Create a `template.html` file in your project's `src` directory with the following placeholders:

| Placeholder | Description |
|-------------|-------------|
| `{{PAGE_TITLE}}` | Project name from package.json |
| `{{PAGE_DESCRIPTION}}` | Project description from package.json |
| `{{PAGE_PATH}}` | Path for canonical URLs |
| `{{GITHUB_REPO_LINK}}` | GitHub repository URL |
| `{{NAVIGATION_LINKS}}` | Auto-generated from README sections |
| `{{BADGES_SECTION}}` | NPM and GitHub badges | 

For custom stylesheets and section templates, use these special markers:

#### Stylesheet Section
```html
{{[BEGIN-STYLESHEET]}}
<link href="/css/style.css" rel="stylesheet">
{{[END-STYLESHEET]}}
```

#### Section Template
```html
{{[BEGIN-SECTION]}}
<section id="{{SECTION_ID}}">
  <h2>{{SECTION_TITLE}}</h2>
  <div>{{SECTION_CONTENT}}</div>
</section>
{{[END-SECTION]}}
```

### 2. Create a Configuration File (Optional)

Create `rtoh.config.js` in your project root:

```javascript
export default {
  // Input files
  readmePath: "README.md",
  templatePath: "src/template.html",
  
  // Custom stylesheet (local or remote URL)
  stylesheetPath: "src/custom-styles.css",
  
  // Output file
  outputPath: "index.html",
  
  // See Configuration section below for more options
}
```

### 3. Run the Conversion Script

| Command | Description |
|---------|-------------|
| `npm run render` | Convert README using default settings |
| `node index.js --config=./path/to/config.js` | Use a custom config file |
| `npm run watch` | Watch mode - auto-rebuild when files change |
| `npm run dev` | Start Vite dev server for live preview |
| `node index.js --help` | Show help information |
| `node index.js --version` | Show version information |

### 4. Deploy to GitHub Pages

Upload your generated `index.html` file and build assets to GitHub Pages.

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

## Customization

You can fully customize the look and feel by editing your template.html file. The package uses [marked](https://github.com/markedjs/marked) for markdown parsing and supports TailwindCSS for styling.

### Configuration

Create a `rtoh.config.js` file in your project root to customize the behavior. This file should export a configuration object:

```javascript
export default {
  // Input files
  readmePath: "README.md",
  templatePath: "src/template.html",
  
  // Output file
  outputPath: "index.html",
  
  // Custom stylesheet (local path or URL)
  stylesheetPath: "src/custom-styles.css",
  // Example of using a remote stylesheet
  // stylesheetPath: "https://raw.githubusercontent.com/rvanbaalen/readme-to-html/main/src/styles.css",
  
  // Customization options
  excludeFromNav: ["description", "contributing", "license"],
  
  // Template string replacements
  replace: {
    "/css/style.css": "./src/style.css" 
  },
  
  // Marked.js options
  markedOptions: {
    gfm: true,            // GitHub Flavored Markdown
    breaks: false,        // Add <br> on single line breaks
    pedantic: false,      // Conform to markdown.pl
    smartLists: true,     // Smarter list behavior
    smartypants: false,   // Smart punctuation like quotes and dashes
    headerIds: true,      // Include IDs in headings
    highlight: function(code, lang) {
      // Custom syntax highlighting function
      return `<code class="language-${lang}">${code}</code>`;
    }
  }
}
```

**Configuration Options:**

- `readmePath`: Path to your README file (default: `README.md`)
- `templatePath`: Path to your HTML template (default: `src/template.html`). This can be:
  - A local file path relative to the project root
  - A URL to fetch the template from (e.g., a GitHub raw URL)
- `outputPath`: Where to save the generated HTML (default: `index.html`)
- `stylesheetPath`: Path to a custom CSS stylesheet (default: empty). This can be:
  - A local file path relative to the project root
  - A URL to fetch the stylesheet from (e.g., a GitHub raw URL)
  - An empty string to use default styling
- `excludeFromNav`: Sections to exclude from navigation bar (default: `["description", "contributing", "license"]`)
- `replace`: Object with key-value pairs for string replacements in the template (default: `{}`)
  - Useful for customizing paths in remote templates (e.g., CSS, JavaScript)
  - Example: `{ "/css/style.css": "./src/style.css" }`
- `markedOptions`: Options passed to the [marked](https://github.com/markedjs/marked) markdown parser (see [marked documentation](https://marked.js.org/using_advanced#options) for all available options)

## Development

To contribute to this project:

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Make your changes
5. Preview with `npm run preview`

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug fixes, please [open an issue](https://github.com/rvanbaalen/readme-to-html/issues/new) or [submit a pull request](https://github.com/rvanbaalen/readme-to-html/pulls).

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.
