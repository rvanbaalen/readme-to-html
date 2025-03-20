# Changelog

## [1.2.0](https://github.com/rvanbaalen/readme-to-html/compare/readme-to-html-v1.1.0...readme-to-html-v1.2.0) (2025-03-20)


### Features

* add --install-workflow option to set up manual deployment GitHub Actions workflow ([55232dc](https://github.com/rvanbaalen/readme-to-html/commit/55232dc2c03725385973a87d64520d6a60b83729))

## [1.1.0](https://github.com/rvanbaalen/readme-to-html/compare/readme-to-html-v1.0.3...readme-to-html-v1.1.0) (2025-03-20)


### Features

* add --cleanup option to remove generated files ([188d19a](https://github.com/rvanbaalen/readme-to-html/commit/188d19a3d3aa65fafaf5bea09729956930c41574))
* add --init option to create a minimal configuration file ([21888f9](https://github.com/rvanbaalen/readme-to-html/commit/21888f9595d8d991040fe6dce85b346da2a8b8a2))
* update release workflow to render README.md to HTML and build static files ([77bd464](https://github.com/rvanbaalen/readme-to-html/commit/77bd4646d2b1105d68f53a80740588453992274d))


### Bug Fixes

* remove index.html from .gitignore and allow tailwind to render the file ([1b1739c](https://github.com/rvanbaalen/readme-to-html/commit/1b1739ca7e76ac3084739ac7046845f1d6bbef3d))
* remove outdated local CSS path in rtoh.config.js ([049f0e1](https://github.com/rvanbaalen/readme-to-html/commit/049f0e133ee8139163537085416c43bdb2fdf4e6))
* update stylesheetPath in rtoh.config.js to point to the correct template directory ([d648abf](https://github.com/rvanbaalen/readme-to-html/commit/d648abf2e33204cfbb56f679fb0072893ae1346f))

## [1.0.3](https://github.com/rvanbaalen/readme-to-html/compare/readme-to-html-v1.0.2...readme-to-html-v1.0.3) (2025-03-19)


### Bug Fixes

* update installation instructions in README.md for clarity ([c00309d](https://github.com/rvanbaalen/readme-to-html/commit/c00309dbc7695dd937015c3e84287864cd9c14e6))

## [1.0.2](https://github.com/rvanbaalen/readme-to-html/compare/readme-to-html-v1.0.1...readme-to-html-v1.0.2) (2025-03-19)


### Bug Fixes

* update templatePath in rtoh.config.js to use remote GitHub template ([bf35548](https://github.com/rvanbaalen/readme-to-html/commit/bf35548b83a1d36dffab42eac305cc21cd487fdc))

## [1.0.1](https://github.com/rvanbaalen/readme-to-html/compare/readme-to-html-v1.0.0...readme-to-html-v1.0.1) (2025-03-19)


### Bug Fixes

* add publishConfig to package.json for public access ([0bfb8f8](https://github.com/rvanbaalen/readme-to-html/commit/0bfb8f8910ec269c126d5b29e566f061f200eb12))

## 1.0.0 (2025-03-19)


### Features

* add configuration file for readme-to-html with template and stylesheet paths ([d71b28a](https://github.com/rvanbaalen/readme-to-html/commit/d71b28a563adcc20145b76cf94cf00876424e7cd))
* add ESLint configuration file for code linting setup ([4f56f2a](https://github.com/rvanbaalen/readme-to-html/commit/4f56f2ab230ef9bae3bfe5c439cfc451b2bab2bd))
* add example and main configuration files for readme-to-html setup ([342c731](https://github.com/rvanbaalen/readme-to-html/commit/342c7318dd10d8a2ec930b50cf7686b0d1dba440))
* add index.html to .gitignore to prevent tracking of generated file ([f0187f1](https://github.com/rvanbaalen/readme-to-html/commit/f0187f14cc8281a477ec02d4c6b716973ec99022))
* add TailwindCSS styles and typography plugin to style.css ([a0ae80f](https://github.com/rvanbaalen/readme-to-html/commit/a0ae80f39fe6ba94f7f6cac574fc77cd17eef86e))
* add template.html for dynamic page rendering with styles and scripts ([c5424c6](https://github.com/rvanbaalen/readme-to-html/commit/c5424c6993a323e085b619380645f6cbe2ee2233))
* implement README to HTML conversion with customizable options and watch mode ([2bca98a](https://github.com/rvanbaalen/readme-to-html/commit/2bca98abebdcce203220825f903c50691a5c17c1))
* rename package and update description, scripts, and repository links ([05aaf35](https://github.com/rvanbaalen/readme-to-html/commit/05aaf3586fe413a6b241e3dd9c5effed7ad56325))
* update base URL in vite.config.js for README to HTML project ([d064baa](https://github.com/rvanbaalen/readme-to-html/commit/d064baae806fe50f91692ca806ce37eeb146f851))
