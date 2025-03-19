/**
 * Example configuration file for readme-to-html
 * Copy this file to rtoh.config.js and modify as needed
 */
export default {
  // Input files
  readmePath: "README.md",
  // templatePath: Local file path or URL
  templatePath: "src/template.html",
  // Example of using a remote template (commented out)
  // templatePath: "https://raw.githubusercontent.com/rvanbaalen/readme-to-html/main/src/template.html",
  
  // Custom stylesheet (local path or URL)
  // Leave empty to use the default Vite stylesheet
  // stylesheetPath: "src/custom-styles.css",
  // Example of using a remote stylesheet (commented out)
  // stylesheetPath: "https://raw.githubusercontent.com/rvanbaalen/readme-to-html/main/src/styles.css",
  
  // Output file
  outputPath: "index.html",
  
  // Customization options
  excludeFromNav: ["description", "contributing", "license"],
  
  // String replacements for template customization
  replace: {
    "/css/style.css": "./src/style.css",
    "https://cdn.example.com/prism.js": "./js/prism.min.js"
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