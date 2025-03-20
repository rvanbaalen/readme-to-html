/**
 * Configuration file for readme-to-html
 * Using a remote template with custom path replacements and stylesheet
 */
export default {
  // Use remote template from GitHub repository
  templatePath: "https://raw.githubusercontent.com/rvanbaalen/rvanbaalen.github.io/refs/heads/main/templates/project-template.html",
  // templatePath: "~/Sites/rvanbaalen.github.io/templates/project-template.html",

  // Custom stylesheet - using local file
  stylesheetPath: "https://raw.githubusercontent.com/rvanbaalen/rvanbaalen.github.io/refs/heads/main/templates/style.css",

  // Fix paths in the remote template to work locally
  replace: {
    "/css/style.css": "/src/custom.css",
    "{{OG_IMAGE}}": "https://socialify.git.ci/rvanbaalen/readme-to-html/image?custom_description=Transform+README.md+into+a+beautiful+GitHub+Pages+site.&description=1&language=1&name=1&owner=1&pattern=Charlie+Brown&theme=Light",
    "{{OG_IMAGE_WIDTH}}": "1200",
    "{{OG_IMAGE_HEIGHT}}": "640",
    "{{FULL_URL}}": "https://robinvanbaalen.nl/readme-to-html/",
  }
}
