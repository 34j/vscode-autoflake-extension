// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as core from "vscode-python-extension-core";
import { PackageInfo } from "vscode-python-extension-core";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const packageInfo: PackageInfo = {
    packageName: "autoflake",
    packageDisplayName: "autoflake",
    extensionName: "autoflake-extension",
    runCommandName: "autoflake-extension.run",
    runForWorkspaceCommandName: "autoflake-extension.runForWorkspace",
    packageConfigurationSection: "autoflake-extension",
    useIntegratedTerminalConfigurationSectionFullName:
      "autoflake-extension.extension.useIntegratedTerminal",
  };
  const disp = new core.commandDispatcher.EasyCommandDispatcher(
    context,
    packageInfo,
    new core.packageRunner.EasyOptionsBuilder(
      packageInfo,
      [
        "check",
        "expand-star-imports",
        "remove-all-unused-imports",
        "ignore-init-module-imports",
        "remove-duplicate-keys",
        "remove-unused-variables",
        "remove-rhs-for-unused-variables",
      ],
      ["jobs"],
      ["exclude", "imports"],
      ["-i"]
    )
  );
  disp.activate();
}

// this method is called when your extension is deactivated
export function deactivate() {}
