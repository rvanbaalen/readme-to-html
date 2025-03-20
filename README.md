# readme-to-html

Transform README.md into a beautiful GitHub Pages site.

## Description

`readme-to-html` is a Node.js tool that converts your project's README.md file into a polished HTML page, perfect for GitHub Pages. It extracts sections from your README, applies styling through customizable templates, and generates a responsive website that showcases your project.

### Features

- 🚀 **Simple Setup**: Convert your README to HTML with a single command
- 🎨 **Customizable**: Use your own HTML templates and CSS styles
- 📱 **Responsive**: Generated pages work on all devices
- 🔄 **Watch Mode**: Automatically rebuild when files change
- 🌐 **Remote Templates**: Use templates and styles from URLs
- 🛠️ **GitHub Integration**: Easily deploy to GitHub Pages

## Installation

```bash
# Install globally
npm install -g @rvanbaalen/readme-to-html

# Or use with npx
npx @rvanbaalen/readme-to-html
```

## Usage

### Quick Start

The simplest way to use readme-to-html is with the default configuration:

```bash
# In your project directory
npx @rvanbaalen/readme-to-html
```

This will:
1. Read your `README.md` file
2. Convert it to HTML using the default template
3. Generate an `index.html` file in your project root

### Configuration

For more control, create a configuration file:

```bash
# Create a minimal configuration file
npx @rvanbaalen/readme-to-html --init
```

This creates a `rtoh.config.js` file in your project with these options:

```javascript
export default {
  // Use a remote template (no need to create your own)
  templatePath: "https://raw.githubusercontent.com/rvanbaalen/rvanbaalen.github.io/refs/heads/main/templates/project-template.html",
  
  // Custom stylesheet (optional)
  stylesheetPath: "https://raw.githubusercontent.com/rvanbaalen/rvanbaalen.github.io/refs/heads/main/templates/style.css",
  
  // Additional options you can customize:
  // outputPath: "index.html",
  // readmePath: "README.md",
  // excludeFromNav: ["description", "contributing", "license"],
  // replace: {
  //   "/css/style.css": "./src/custom.css"
  // }
}
```

### Command Line Options

```
readme-to-html - Convert README.md to a beautiful HTML page

Options:
  --config=<path>, -c=<path>   Specify a custom configuration file
  --watch, -w                  Watch mode: automatically rebuild when files change
  --cleanup                    Remove all generated files
  --init                       Create a minimal configuration file (rtoh.config.js)
  --install-workflow           Install GitHub Actions workflow for manual deployments
  --help, -h                   Show this help information
  --version, -v                Show version information
```

### Watch Mode

For continuous development, use watch mode to automatically rebuild when your README changes:

```bash
npx @rvanbaalen/readme-to-html --watch
```

### GitHub Pages Integration

To set up automatic deployments to GitHub Pages:

```bash
# Install GitHub Actions workflow
npx @rvanbaalen/readme-to-html --install-workflow
```

This creates a workflow file that you can trigger manually from the GitHub Actions tab.

## Advanced Configuration

### Template Customization

You can use your own HTML template by setting the `templatePath` in your configuration:

```javascript
export default {
  templatePath: "path/to/your/template.html",
  // ... other options
}
```

Templates should include these markers:
- `{{PAGE_TITLE}}` - Project name from package.json
- `{{PAGE_DESCRIPTION}}` - Project description from package.json
- `{{NAVIGATION_LINKS}}` - Auto-generated navigation links
- `{{BADGES_SECTION}}` - NPM and GitHub badges
- `{{[BEGIN-SECTION]}}` and `{{[END-SECTION]}}` - Section template
- `{{SECTION_ID}}`, `{{SECTION_TITLE}}`, `{{SECTION_CONTENT}}` - Used within section template

### Custom Styling

To use your own stylesheet:

```javascript
export default {
  stylesheetPath: "path/to/your/styles.css",
  // ... other options
}
```

You can also use remote stylesheets by providing a URL.

### String Replacements

The `replace` option lets you customize template content without modifying the template itself:

```javascript
export default {
  replace: {
    "/css/style.css": "./src/custom.css",
    "{{OG_IMAGE}}": "https://example.com/your-image.png"
  },
  // ... other options
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
