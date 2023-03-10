# Joplin Plugin

This is a template to create a new Joplin plugin.

The main two files you will want to look at are:

- `/src/index.ts`, which contains the entry point for the plugin source code.
- `/src/manifest.json`, which is the plugin manifest. It contains information such as the plugin a name, version, etc.

## Building the plugin

The plugin is built using Webpack, which creates the compiled code in `/dist`. A JPL archive will also be created at the root, which can use to distribute the plugin.

To build the plugin, simply run `npm run dist`.

The project is setup to use TypeScript, although you can change the configuration to use plain JavaScript.

## Updating the plugin framework

To update the plugin framework, run `npm run update`.

In general this command tries to do the right thing - in particular it's going to merge the changes in package.json and .gitignore instead of overwriting. It will also leave "/src" as well as README.md untouched.

The file that may cause problem is "webpack.config.js" because it's going to be overwritten. For that reason, if you want to change it, consider creating a separate JavaScript file and include it in webpack.config.js. That way, when you update, you only have to restore the line that include your file.

# Status
WIP -> ALPHA

# Limitation, read before using
* The plugin will sync your highlights to a folder called `Readwise`. If you already have such a folder, consider renaming it. 
* The plugin will only sync on startup of Joplin.

# Usage

1. Create / Retrieve your API token from Readwise [here](https://readwise.io/access_token) and keep it ready.
2. Install the plugin jpl in Joplin. If you build it yourself by running `np, run dist`, you find the file in the `publish` folder. 
3. Open the settings window of the Plugin called `Readwise-Sync` and enter your token in the dedicated field.
4. Restart the application, your highlights should no sync to a folder called Readwise.

# Troubleshooting
SSL Error with webpack, set environment variable
```
export NODE_OPTIONS=--openssl-legacy-provider
```
see [Issue](https://github.com/webpack/webpack/issues/14532).
