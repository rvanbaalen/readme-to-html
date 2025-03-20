import fs from 'fs/promises';
import { watch, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { URL } from 'url';
import { spawn } from 'child_process';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read package.json for version information
const packageJsonPath = path.join(__dirname, 'package.json');
let packageInfo = { version: '0.0.0', name: 'readme-to-html' };

try {
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
  packageInfo = JSON.parse(packageJsonContent);
} catch (err) {
  console.warn('Warning: Could not read package.json for version info');
}

// Show help information
function showHelp() {
  console.log(`
readme-to-html - Convert README.md to a beautiful HTML page

Usage:
  node index.js [options]

Options:
  --config=<path>, -c=<path>   Specify a custom configuration file
  --watch, -w                  Watch mode: automatically rebuild when files change
  --cleanup                    Remove all generated files
  --init                       Create a minimal configuration file (rtoh.config.js)
  --install-workflow           Install GitHub Actions workflow for manual deployments
  --help, -h                   Show this help information
  --version, -v                Show version information

Examples:
  node index.js
  node index.js --config=./custom-config.js
  node index.js --watch
  node index.js --cleanup
  node index.js --init
  node index.js --install-workflow
  
For more information, visit: ${packageInfo.homepage || 'https://github.com/rvanbaalen/readme-to-html'}
`);
  process.exit(0);
}

/**
 * Create initial config file
 */
async function createInitialConfig() {
  console.log('🛠️  Creating minimal configuration file...');
  
  const configPath = path.join(process.cwd(), 'rtoh.config.js');
  
  // Check if the file already exists
  if (existsSync(configPath)) {
    console.warn(`⚠️  Configuration file already exists at ${configPath}`);
    const overwrite = await promptForOverwrite();
    
    if (!overwrite) {
      console.log('❌ Operation cancelled. Existing configuration file was not modified.');
      return;
    }
  }
  
  // Define minimal configuration template
  const configTemplate = `/**
 * Configuration file for readme-to-html
 * Generated with the --init command
 */
export default {
  // Use a remote template (no need to create your own)
  templatePath: "https://raw.githubusercontent.com/rvanbaalen/rvanbaalen.github.io/refs/heads/main/templates/project-template.html",
  
  // Custom stylesheet (optional)
  stylesheetPath: "https://raw.githubusercontent.com/rvanbaalen/rvanbaalen.github.io/refs/heads/main/templates/style.css",
  
  // Uncomment and customize any additional options as needed:
  // outputPath: "index.html",
  // readmePath: "README.md",
  // excludeFromNav: ["description", "contributing", "license"],
  // replace: {
  //   "/css/style.css": "./src/custom.css"
  // }
}
`;

  try {
    // Write the configuration file
    await fs.writeFile(configPath, configTemplate, 'utf8');
    console.log(`✅ Configuration file created at: ${configPath}`);
    console.log('\nNext steps:');
    console.log('1. Customize the configuration file if needed');
    console.log('2. Run `npx @rvanbaalen/readme-to-html` to generate your HTML');
  } catch (error) {
    console.error(`Error creating configuration file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Install manual deployment GitHub Actions workflow
 */
async function installWorkflow() {
  console.log('🛠️  Installing GitHub Actions workflow for manual deployments...');
  
  // Create .github/workflows directory if it doesn't exist
  const workflowsDir = path.join(process.cwd(), '.github', 'workflows');
  const workflowPath = path.join(workflowsDir, 'manual-build-deploy.yml');
  
  try {
    // Create the directories if they don't exist
    await fs.mkdir(workflowsDir, { recursive: true });
    
    // Check if the workflow file already exists
    if (existsSync(workflowPath)) {
      console.warn(`⚠️  Workflow file already exists at ${workflowPath}`);
      const overwrite = await promptForOverwrite();
      
      if (!overwrite) {
        console.log('❌ Operation cancelled. Existing workflow file was not modified.');
        return;
      }
    }
    
    // Define workflow file content
    const workflowContent = `name: Manual Build & Deploy

# This workflow allows you to manually build and deploy the project
# without creating a new release

on:
  workflow_dispatch:
    # Optional inputs for the workflow
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'github-pages'
        type: choice
        options:
          - github-pages

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: 'package.json'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Render README.md to HTML
        run: node ./index.js

      - name: Build HTML to static files
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  # Deployment job
  deploy:
    environment:
      name: \${{ inputs.environment }}
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
    
    // Write the workflow file
    await fs.writeFile(workflowPath, workflowContent, 'utf8');
    console.log(`✅ GitHub Actions workflow created at: ${workflowPath}`);
    console.log('\nNext steps:');
    console.log('1. Commit and push the workflow file to your repository');
    console.log('2. Go to GitHub Actions tab to manually trigger the workflow');
  } catch (error) {
    console.error(`Error creating workflow file: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Prompt for overwriting existing configuration
 * @returns {Promise<boolean>} True if user confirms overwrite
 */
async function promptForOverwrite() {
  // We can't use built-in readline in ESM, so using a simple approach
  console.log('Do you want to overwrite the existing configuration file? (y/N):');
  
  return new Promise(resolve => {
    process.stdin.resume();
    process.stdin.once('data', data => {
      const input = data.toString().trim().toLowerCase();
      process.stdin.pause();
      resolve(input === 'y' || input === 'yes');
    });
  });
}

/**
 * Cleanup generated files
 */
async function cleanupFiles() {
  console.log('🧹 Cleaning up generated files...');
  
  const filesToRemove = [
    // Default output HTML file
    path.join(__dirname, 'index.html'),
    // Build directory with generated assets
    path.join(__dirname, 'build')
  ];
  
  try {
    // Try to load config to get custom paths if they exist
    let config = null;
    const configPath = path.join(__dirname, 'rtoh.config.js');
    
    if (existsSync(configPath)) {
      try {
        const userConfigModule = await import(`file://${configPath}`);
        config = userConfigModule.default || {};
        console.log('Found configuration file, checking for custom paths...');
      } catch (err) {
        console.log('Could not load config file, using default paths for cleanup.');
      }
    }
    
    // Add custom output path if defined in config
    if (config && config.outputPath) {
      const customOutputPath = resolveFilePath(config.outputPath, __dirname);
      if (!filesToRemove.includes(customOutputPath)) {
        filesToRemove.push(customOutputPath);
      }
    }
    
    // Process each file/directory
    for (const filePath of filesToRemove) {
      if (existsSync(filePath)) {
        const stats = await fs.stat(filePath);
        
        if (stats.isDirectory()) {
          // Remove directory recursively
          await fs.rm(filePath, { recursive: true, force: true });
          console.log(`✅ Removed directory: ${filePath}`);
        } else {
          // Remove file
          await fs.unlink(filePath);
          console.log(`✅ Removed file: ${filePath}`);
        }
      }
    }
    
    console.log('🎉 Cleanup complete!');
  } catch (error) {
    console.error(`Error during cleanup: ${error.message}`);
    process.exit(1);
  }
}

// Show version information
function showVersion() {
  console.log(`${packageInfo.name} v${packageInfo.version}`);
  process.exit(0);
}

// Default configuration
const defaultConfig = {
  // Input files
  readmePath: 'README.md',
  templatePath: 'src/template.html',
  // Output file
  outputPath: 'index.html',
  // Stylesheet (can be local path or URL)
  stylesheetPath: '', // Empty means use the default style.css from Vite
  // Customization options
  excludeFromNav: ['description', 'contributing', 'license'],
  // Template string replacements (e.g., for stylesheet paths)
  replace: {},
  markedOptions: {
    highlight: function(code, lang) {
      return `<code class="language-${lang}">${code}</code>`;
    }
  }
};

/**
 * Load configuration from file or use defaults
 * @returns {Object} Configuration object
 */
async function loadConfig() {
  // Check if we have cached config and should use it
  if (global.__RTOH_CONFIG_CACHE && !global.__RTOH_CONFIG_RELOAD_NEEDED) {
    return global.__RTOH_CONFIG_CACHE;
  }

  // Check for command line arguments
  let customConfigPath = null;
  const args = process.argv.slice(2);

  // Process help and version arguments first (highest priority)
  for (const arg of args) {
    // Handle help
    if (arg === '--help' || arg === '-h') {
      showHelp();
    }

    // Handle version
    if (arg === '--version' || arg === '-v') {
      showVersion();
    }

    // Check for watch mode
    if (arg === '--watch' || arg === '-w') {
      global.watchMode = true;
    }
    
    // Check for cleanup mode
    if (arg === '--cleanup') {
      await cleanupFiles();
      process.exit(0);
    }
    
    // Check for init mode
    if (arg === '--init') {
      await createInitialConfig();
      process.exit(0);
    }
    
    // Check for install-workflow mode
    if (arg === '--install-workflow') {
      await installWorkflow();
      process.exit(0);
    }
  }

  // Look for --config= or -c= argument
  for (const arg of args) {
    if (arg.startsWith('--config=')) {
      customConfigPath = arg.substring('--config='.length);
      break;
    } else if (arg.startsWith('-c=')) {
      customConfigPath = arg.substring('-c='.length);
      break;
    }
  }

  let configPath;

  if (customConfigPath) {
    // If custom config path is provided via command line
    configPath = path.resolve(process.cwd(), customConfigPath);
    console.log(`Looking for custom config at: ${configPath}`);
  } else {
    // Default config path in project root
    configPath = path.join(__dirname, 'rtoh.config.js');
  }

  try {
    // Check if config file exists
    if (existsSync(configPath)) {
      try {
        // Force cache bust by adding a timestamp to the import URL
        const importUrl = configPath.startsWith('/')
          ? `file://${configPath}?t=${Date.now()}`
          : `${configPath}?t=${Date.now()}`;

        // Import the config module with cache busting
        const userConfigModule = await import(importUrl);
        const userConfig = userConfigModule.default || {};

        console.log(`Using configuration file: ${configPath}`);

        // Deep merge for nested objects like markedOptions
        const mergedConfig = { ...defaultConfig };

        // Merge top-level properties
        Object.keys(userConfig).forEach(key => {
          if (key === 'markedOptions' && userConfig.markedOptions) {
            // Special handling for markedOptions to ensure deep merge
            mergedConfig.markedOptions = {
              ...defaultConfig.markedOptions,
              ...userConfig.markedOptions
            };
          } else {
            // Regular merge for other properties
            mergedConfig[key] = userConfig[key];
          }
        });

        // Cache the config for future use
        global.__RTOH_CONFIG_CACHE = mergedConfig;
        global.__RTOH_CONFIG_RELOAD_NEEDED = false;

        return mergedConfig;
      } catch (importError) {
        console.warn(`Warning: Error importing config file: ${importError.message}`);
        if (customConfigPath) {
          console.error(`Could not load custom config from ${configPath}. Please check the file path and format.`);
          process.exit(1);
        }
        console.log('Falling back to default configuration');
        return defaultConfig;
      }
    } else {
      if (customConfigPath) {
        console.error(`Custom config file not found at ${configPath}`);
        process.exit(1);
      } else {
        console.log('No configuration file found, using defaults');
        return defaultConfig;
      }
    }
  } catch (error) {
    console.warn(`Warning: Error reading config file: ${error.message}`);
    if (customConfigPath) {
      console.error(`Error accessing custom config file at ${configPath}`);
      process.exit(1);
    }
    console.log('Falling back to default configuration');
    return defaultConfig;
  }
}

/**
 * Escape string for use in regular expression
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if a string is a valid URL
 * @param {string} str - The string to check
 * @returns {boolean} - True if it's a valid URL, false otherwise
 */
function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Resolve a file path that could be relative or absolute
 * @param {string} filePath - The file path to resolve
 * @param {string} baseDir - The base directory to resolve relative paths from
 * @returns {string} - The resolved absolute path
 */
function resolveFilePath(filePath, baseDir) {
  // Handle home directory tilde (~) expansion
  if (filePath.startsWith('~')) {
    const homedir = process.env.HOME || process.env.USERPROFILE;
    filePath = path.join(homedir, filePath.slice(1));
  }
  
  // Check if the path is absolute
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  
  // It's a relative path, join with the base directory
  return path.join(baseDir, filePath);
}

/**
 * Fetch content from a URL
 * @param {string} url - The URL to fetch
 * @param {string} contentType - The type of content being fetched (for logging purposes)
 * @returns {Promise<string>} - The content as text
 */
async function fetchFromUrl(url, contentType = 'template') {
  try {
    console.log(`Fetching ${contentType} from URL: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${contentType}: ${response.status} ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error fetching from URL: ${error.message}`);
    throw error;
  }
}

/**
 * Load stylesheet content from path or URL
 * @param {string} stylesheetPath - Path or URL to the stylesheet
 * @param {string} __dirname - Current directory path
 * @returns {Promise<string|null>} - The stylesheet content or null if no path provided
 */
async function loadStylesheet(stylesheetPath, __dirname) {
  if (!stylesheetPath) {
    console.log('No custom stylesheet specified, using default');
    return null;
  }

  try {
    if (isValidUrl(stylesheetPath)) {
      // Fetch stylesheet from URL
      return await fetchFromUrl(stylesheetPath, 'stylesheet');
    } else {
      // Read from local file system
      const stylesheetFilePath = resolveFilePath(stylesheetPath, __dirname);
      console.log(`Loading stylesheet from: ${stylesheetFilePath}`);

      return await fs.readFile(stylesheetFilePath, 'utf8')
        .catch(error => {
          console.warn(`Warning: Could not read stylesheet at ${stylesheetFilePath}: ${error.message}`);
          console.log('Falling back to default styling');
          return null;
        });
    }
  } catch (error) {
    console.warn(`Warning: Error loading stylesheet: ${error.message}`);
    console.log('Falling back to default styling');
    return null;
  }
}

async function render() {
  // Load configuration
  const config = await loadConfig();

  // Read README.md
  const readmePath = resolveFilePath(config.readmePath, __dirname);
  const readmeContent = await fs.readFile(readmePath, 'utf8');

  // Get template content from either URL or local file
  let templateContent;

  if (isValidUrl(config.templatePath)) {
    // Fetch template from URL
    templateContent = await fetchFromUrl(config.templatePath);
  } else {
    // Read from local file system
    const templateFilePath = resolveFilePath(config.templatePath, __dirname);
    console.log(`Loading template from: ${templateFilePath}`);
    
    templateContent = await fs.readFile(templateFilePath, 'utf8')
      .catch(error => {
        // Fallback to regular template.html if src/template.html doesn't exist
        if (error.code === 'ENOENT' && config.templatePath === 'src/template.html') {
          console.log('Falling back to template.html in root directory');
          return fs.readFile(path.join(__dirname, 'template.html'), 'utf8');
        }
        throw error;
      });
  }

  // Load custom stylesheet if specified
  const stylesheetContent = await loadStylesheet(config.stylesheetPath, __dirname);

  // When a custom stylesheet is loaded, we'll replace the entire stylesheet section
  let stylesheetReplacement = null;

  if (stylesheetContent) {
    // Generate a unique asset filename for Vite to process
    const stylesheetFilename = `style.css`;
    const buildDir = 'build';
    const stylesheetOutputPath = path.join(__dirname, buildDir, stylesheetFilename);

    // Write the stylesheet content to a file in the build directory so Vite can process it
    await fs.mkdir(path.join(__dirname, buildDir), { recursive: true });
    await fs.writeFile(stylesheetOutputPath, stylesheetContent, 'utf8');
    console.log(`Custom stylesheet written to: ${stylesheetOutputPath}`);

    // Create a link tag referencing the stylesheet with a relative path
    // Use ./ instead of / for better compatibility with different deployment scenarios
    stylesheetReplacement = `<link href="./${buildDir}/${stylesheetFilename}?${Date.now()}" rel="stylesheet">`;
  }

  // Apply template string replacements if any are defined
  if (config.replace && Object.keys(config.replace).length > 0) {
    console.log('Applying template string replacements');

    for (const [original, replacement] of Object.entries(config.replace)) {
      // Using a global replace to replace all occurrences
      const regex = new RegExp(escapeRegExp(original), 'g');
      templateContent = templateContent.replace(regex, replacement);
    }
  }

  // Configure marked with options from config
  marked.setOptions(config.markedOptions);

  // Parse README.md to HTML
  const readmeHtml = marked(readmeContent);

  // Get package information
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);

  // Validate required package.json fields
  if (!packageJson.name) {
    console.error('Error: package.json must have a "name" field.');
    process.exit(1);
  }

  if (!packageJson.description) {
    console.error('Error: package.json must have a "description" field.');
    process.exit(1);
  }

  // Extract title and description from package.json
  const title = packageJson.name;
  const description = packageJson.description;

  // Get package name for badges - strip @ prefix if present
  const packageNameForBadges = packageJson.name.replace(/^@/, '');
  const [orgName, repoName] = packageNameForBadges.split('/');

  if (!orgName || !repoName) {
    console.error('Error: package.json name must be in format "orgName/repoName" or "@orgName/repoName".');
    process.exit(1);
  }

  // Encode package name for URL
  const encodedPackageName = encodeURIComponent(packageJson.name);

  // Extract repository URL path and full GitHub URL from package.json if available
  const repoPath = packageJson.repository?.url?.match(/github\.com\/([^/.]+\/[^/.]+)(?:\.git)?$/)?.[1] ||
    `${orgName}/${repoName}`;

  // Get the full GitHub repo URL (for the GITHUB_REPO_LINK template variable)
  let githubRepoLink = '';
  if (packageJson.repository?.url) {
    // Handle different URL formats (git+https://, git://, etc.)
    githubRepoLink = packageJson.repository.url
      .replace(/^git\+/, '')      // Remove git+ prefix if present
      .replace(/^git:\/\//, 'https://') // Replace git:// with https://
      .replace(/^ssh:\/\//, 'https://') // Replace ssh:// with https://
      .replace(/^git@github\.com:/, 'https://github.com/') // Convert SSH format to HTTPS
      .replace(/\.git$/, '');     // Remove .git suffix if present

    // If it's still not an HTTP URL, create one from the repo path
    if (!githubRepoLink.startsWith('http')) {
      // Extract repo path from the URL or use the fallback
      const extractedPath = githubRepoLink.match(/github\.com\/([^/.]+\/[^/.]+)(?:\.git)?$/)?.[1] || repoPath;
      githubRepoLink = `https://github.com/${extractedPath}`;
    }
  } else {
    // Fallback to constructing URL from package name
    githubRepoLink = `https://github.com/${repoPath}`;
  }

  // Log the GitHub repository link for verification
  console.log(`GitHub repository link: ${githubRepoLink}`);

  // Extract sections from README content
  const sections = extractSectionsFromReadme(readmeHtml);

  // Create badges section HTML using template literal with dynamic package name
  const badgesSection = `
    <div class="flex gap-2 mb-8">
      <img src="https://img.shields.io/npm/d18m/${encodedPackageName}" alt="NPM Downloads">
      <img src="https://img.shields.io/github/license/${repoPath}" alt="GitHub License">
      <img src="https://img.shields.io/npm/v/${encodedPackageName}" alt="NPM Version">
    </div>
  `.trim();

  // Create navigation links based on sections using excludeFromNav from config
  const navigationLinks = Object.keys(sections)
    .filter(section => !config.excludeFromNav.includes(section.toLowerCase()))
    .map(section => `<li><a href="#${section.toLowerCase()}" class="hover:text-white/80 transition">${section}</a></li>`)
    .join('\n                        ');

  // Extract section template
  const sectionMatch = templateContent.match(/\{\{\[BEGIN-SECTION\]\}\}([\s\S]*?)\{\{\[END-SECTION\]\}\}/);
  if (!sectionMatch) {
    console.error('Error: Could not find section template markers in template.html');
    process.exit(1);
  }

  // Get the section template
  const sectionTemplate = sectionMatch[1];

  // Create HTML sections by applying the template to each section
  const sectionsHtml = Object.entries(sections)
    .map(([title, content]) => {
      const sectionId = title.toLowerCase() === 'description' ? '' : ` id="${title.toLowerCase()}"`;
      return sectionTemplate
        .replace('{{SECTION_ID}}', sectionId)
        .replace('{{SECTION_TITLE}}', title)
        .replace('{{SECTION_CONTENT}}', content);
    })
    .join('');

  // Get page path from package.json if available
  const pagePath = packageJson.name.split('/')[1] || '';

  // Replace template variables with actual content
  let renderedHtml = templateContent
    .replace(/{{PAGE_TITLE}}/g, title)
    .replace(/{{PAGE_DESCRIPTION}}/g, description)
    .replace(/{{PAGE_PATH}}/g, pagePath)
    .replace(/{{GITHUB_REPO_LINK}}/g, githubRepoLink)
    .replace('{{NAVIGATION_LINKS}}', navigationLinks)
    .replace('{{BADGES_SECTION}}', badgesSection);
    
  // Create a function to safely replace only in the head section, not in code examples
  function replaceInHeadSection(html, pattern, replacement) {
    // Find the head closing tag
    const headEndIndex = html.indexOf('</head>');
    if (headEndIndex === -1) return html; // If we can't find the head, return unchanged
    
    // Split the document into head and body
    const headSection = html.substring(0, headEndIndex);
    const restOfDocument = html.substring(headEndIndex);
    
    // Replace only in the head section - do a single replace instead of global
    const modifiedHead = headSection.replace(pattern, replacement);
    
    // Recombine the document
    return modifiedHead + restOfDocument;
  }

  // Replace stylesheet section in the head with custom stylesheet if provided
  if (stylesheetReplacement) {
    console.log(`Generated stylesheet link: ${stylesheetReplacement}`);
    
    // Create a pattern that specifically targets the head section
    // First occurrence only, so no global flag
    const stylesheetPattern = /\{\{\[BEGIN-STYLESHEET\]\}\}[\s\S]*?\{\{\[END-STYLESHEET\]\}\}/;
    
    // Try to replace the stylesheet markers if they exist
    const hasStylesheetMarkers = stylesheetPattern.test(renderedHtml);
    console.log(`Template has stylesheet markers: ${hasStylesheetMarkers}`);
    
    if (hasStylesheetMarkers) {
      renderedHtml = replaceInHeadSection(
        renderedHtml, 
        stylesheetPattern, 
        stylesheetReplacement
      );
      console.log('Replaced stylesheet section markers with custom stylesheet');
    } else {
      // If markers don't exist, directly insert before </head>
      const headEndIndex = renderedHtml.indexOf('</head>');
      if (headEndIndex !== -1) {
        renderedHtml = 
          renderedHtml.substring(0, headEndIndex) + 
          `\n    ${stylesheetReplacement}\n` + 
          renderedHtml.substring(headEndIndex);
        console.log('Directly injected stylesheet link before </head> tag');
      } else {
        console.warn('Could not find </head> tag in template to inject stylesheet');
      }
    }
  }
  
  // Find main content area to replace section template
  const mainOpenTagIndex = renderedHtml.indexOf('<main');
  const mainCloseTagIndex = renderedHtml.lastIndexOf('</main>');
  
  if (mainOpenTagIndex !== -1 && mainCloseTagIndex !== -1) {
    // Split the document
    const beforeMain = renderedHtml.substring(0, mainOpenTagIndex);
    const mainSection = renderedHtml.substring(mainOpenTagIndex, mainCloseTagIndex);
    const afterMain = renderedHtml.substring(mainCloseTagIndex);
    
    // Replace only in the main section
    const modifiedMain = mainSection.replace(
      /\{\{\[BEGIN-SECTION\]\}\}[\s\S]*?\{\{\[END-SECTION\]\}\}/, 
      sectionsHtml
    );
    
    // Recombine the document
    renderedHtml = beforeMain + modifiedMain + afterMain;
  }

  // Fix code blocks formatting to ensure proper Prism.js highlighting
  renderedHtml = renderedHtml.replace(/<pre><code class="language-([^"]+)">/g, '<pre><code class="language-$1">');

  // Write to the output file specified in the config
  await fs.writeFile(path.join(__dirname, config.outputPath), renderedHtml, 'utf8');
  console.log(`Successfully rendered ${config.readmePath} to ${config.outputPath}`);
}

function extractSectionsFromReadme(html) {
  const sections = {};
  let currentSection = 'Description';
  let currentContent = '';

  // Split HTML by h2 tags to identify sections
  const parts = html.split(/<h2[^>]*>|<\/h2>/);

  for (let i = 0; i < parts.length; i++) {
    if (i === 0) {
      // First part is introduction before any h2
      if (parts[i].trim()) {
        currentContent = parts[i];
      }
    } else if (i % 2 === 1) {
      // Odd parts are h2 heading text
      if (currentContent) {
        sections[currentSection] = currentContent;
      }
      currentSection = parts[i].replace(/<[^>]*>/g, '').trim();
      currentContent = '';
    } else {
      // Even parts are content between h2 tags
      currentContent = parts[i];
    }
  }

  // Add the last section
  if (currentContent) {
    sections[currentSection] = currentContent;
  }

  return sections;
}

/**
 * Start watch mode
 * @param {Object} config - Configuration object
 */
async function startWatchMode(config) {
  console.log('👀 Starting watch mode...');

  // Files to watch
  const filesToWatch = [
    resolveFilePath(config.readmePath, __dirname),
    path.join(__dirname, 'package.json')
  ];

  // Add template file to watch if it's local (not a URL)
  if (!isValidUrl(config.templatePath)) {
    // Get the absolute path of the template file
    const templatePath = resolveFilePath(config.templatePath, __dirname);
    filesToWatch.push(templatePath);
    console.log(`Watching template: ${templatePath}`);
    
    // Also watch the fallback template.html if using the default path
    if (config.templatePath === 'src/template.html') {
      const fallbackPath = path.join(__dirname, 'template.html');
      filesToWatch.push(fallbackPath);
      console.log(`Watching fallback template: ${fallbackPath}`);
    }
  }

  // Add stylesheet file to watch if it's local (not a URL)
  if (config.stylesheetPath && !isValidUrl(config.stylesheetPath)) {
    // Get the absolute path of the stylesheet file
    const stylesheetPath = resolveFilePath(config.stylesheetPath, __dirname);
    filesToWatch.push(stylesheetPath);
    console.log(`Watching stylesheet: ${stylesheetPath}`);
  }

  // Add config file to watch if it exists
  const configPath = path.join(__dirname, 'rtoh.config.js');
  if (existsSync(configPath)) {
    filesToWatch.push(configPath);
  }

  console.log('Files being watched:');
  filesToWatch.forEach(file => {
    if (existsSync(file)) {
      console.log(`- ${file}`);
    }
  });
  console.log('\n✅ Initial render complete');
  console.log('👀 Watching for changes... (Press Ctrl+C to stop)');

  // Start watchers
  let debounceTimer;
  const watchers = [];

  // Set up file watchers
  filesToWatch.forEach(file => {
    if (existsSync(file)) {
      const watcher = watch(file, (eventType) => {
        if (eventType === 'change') {
          // Debounce to avoid multiple runs for rapid changes
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(async () => {
            console.log(`\n📝 Changes detected in ${path.basename(file)}`);

            // If the config file changed, we need to reload the config before rendering
            if (file.endsWith('rtoh.config.js')) {
              console.log('Configuration file changed, reloading config...');
              // Force a config reload
              global.__RTOH_CONFIG_RELOAD_NEEDED = true;

              // Give the file system a moment to finish writing the file
              await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Render with fresh config
            try {
              await render();
              console.log('👀 Watching for changes... (Press Ctrl+C to stop)');
            } catch (error) {
              console.error(`Error: ${error.message}`);
              console.log('👀 Watching for changes... (Press Ctrl+C to stop)');
            }
          }, 300);
        }
      });

      watchers.push(watcher);
    }
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping file watchers...');
    watchers.forEach(watcher => watcher.close());
    process.exit(0);
  });
}

// Execute the render function and handle errors
render().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}).then(async () => {
  // Start watch mode if requested
  if (global.watchMode) {
    // Get configuration again to pass to watch mode
    const config = await loadConfig();
    startWatchMode(config);
  }
});
