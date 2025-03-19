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

1. **Create a template.html file** in your project's src directory. This file should include placeholder variables that will be replaced with content from your README.md:

```html
<!-- Required placeholders -->
{{PAGE_TITLE}} <!-- From package.json name -->
{{PAGE_DESCRIPTION}} <!-- From package.json description -->
{{PAGE_PATH}} <!-- For canonical URLs -->
{{GITHUB_REPO_LINK}} <!-- GitHub repository URL -->
{{NAVIGATION_LINKS}} <!-- Auto-generated from README sections -->
{{BADGES_SECTION}} <!-- NPM and GitHub badges -->

<!-- Section template markers -->
{{[BEGIN-SECTION]}}
  <!-- Your section template with these placeholders: -->
  {{SECTION_ID}} <!-- ID attribute for anchor links -->
  {{SECTION_TITLE}} <!-- Section title (from README h2) -->
  {{SECTION_CONTENT}} <!-- Content between section headings -->
{{[END-SECTION]}}
```

2. **Optional: Create a configuration file** to customize paths and behavior:

```javascript
// Create rtoh.config.js in your project root
export default {
  // Your configuration options
  // See Configuration section below
}
```

3. **Run the conversion script**:

```bash
# Use default configuration
node index.js
# or
npm run render

# Or specify a custom config file
node index.js --config=./path/to/custom-config.js
node index.js -c=./path/to/custom-config.js
# or using npm script
npm run render -- --config=./path/to/custom-config.js

# Show help information
node index.js --help
node index.js -h

# Show version information
node index.js --version
node index.js -v
```

4. **Deploy to GitHub Pages** using your newly generated index.html file.

## Features

- **Automatic Navigation**: Creates a navigation menu from your README.md sections
- **Section-Based Layout**: Organizes content by README.md headings
- **Syntax Highlighting**: Includes Prism.js for beautiful code blocks
- **Responsive Design**: Looks great on all devices
- **SEO-Friendly**: Includes meta tags for better search engine visibility
- **GitHub Integration**: Automatically detects repository information
- **Customizable**: Complete control over HTML/CSS through template.html
- **Configurable**: Support for custom configuration via JSON file

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
  
  // Customization options
  excludeFromNav: ["description", "contributing", "license"],
  
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
- `templatePath`: Path to your HTML template (default: `src/template.html`)
- `outputPath`: Where to save the generated HTML (default: `index.html`)
- `excludeFromNav`: Sections to exclude from navigation bar (default: `["description", "contributing", "license"]`)
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