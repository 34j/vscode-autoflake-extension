# autoflake-vscode-extension

[![GitHub](https://img.shields.io/github/license/34j/autoflake-vscode-extension?logo=github&logoColor=%23181717)](https://github.com/34j/autoflake-vscode-extension)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/mikoz.autoflake-extension?logo=visual-studio-code&logoColor=%23007ACC)](https://marketplace.visualstudio.com/items?itemName=mikoz.autoflake-extension)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/mikoz.autoflake-extension)](https://marketplace.visualstudio.com/items?itemName=mikoz.autoflake-extension)

VSCode extension for removing unused imports using [autoflake](https://github.com/PyCQA/autoflake) from the GUI.

[![Install Now](https://img.shields.io/badge/-Install%20Now-107C10?style=for-the-badge&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=mikoz.autoflake-extension)

## Features

- Running autoflake for specific file(s) and folder(s)
- Running autoflake for the workspace

![Example GIF](https://raw.githubusercontent.com/34j/autoflake-vscode-extension/main/images/Example.gif)

## Requirements

autoflake>=1.5.2

```shell
pip install -U autoflake
```

It may work with lower versions, but some of the options will not work.

## Extension Settings

This extension contributes the following settings: (Most of the available options in autoflake.)

- `autoflake-extension.expand-star-imports`: expand wildcard star imports with undefined names; this only triggers if there is only one star import in the file; this is skipped if there are any uses of `__all__` or `del` in the file
- `autoflake-extension.remove-all-unused-imports`: remove all unused imports (not just those from the standard library)
- `autoflake-extension.ignore-init-module-imports`: exclude __init__.py when removing unused imports
- `autoflake-extension.remove-duplicate-keys`: remove all duplicate keys in objects
- `autoflake-extension.remove-unused-variables`: remove unused variables
- `autoflake-extension.remove-rhs-for-unused-variables`: remove RHS of statements when removing unused variables (unsafe)
- `autoflake-extension.check`: return error code if changes are needed
- `autoflake-extension.jobs`: number of parallel jobs; match CPU count if value is 0 (default: 0)
- `autoflake-extension.exclude`: exclude file/directory names that match these globs
- `autoflake-extension.imports`: by default, only unused standard library imports are removed; specify a list of additional modules/packages

![Settings](https://raw.githubusercontent.com/34j/autoflake-vscode-extension/main/images/Settings.png)

## Known Issues

If you are using venv and intentionally somewhat deactivate venv after this extension opened a teminal, it will not work unless you close the terminal.
