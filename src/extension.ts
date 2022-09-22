// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PythonHiddenTerminal } from "./pythonTerminal/pythonHiddenTerminal";
import { AutoflakeRunner } from './autoflakeRunner';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const autoflakeRunner = new AutoflakeRunner(new PythonHiddenTerminal(undefined));
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autoflake-extension" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'autoflake-extension.run',
		async (uri: vscode.Uri, uris: vscode.Uri[]) => {
			// The code you place here will be executed every time your command is executed

			// if the command is called from Command Palette, uri and uris are undefined
			// we use the current file

			// To support calling the command from other scripts, we check both uris and uri.
			// Uris take precedence over uri.
			if (uris === undefined) {
				if (uri === undefined) {
					const activeTextEditor = vscode.window.activeTextEditor;
					if (activeTextEditor === undefined) {
						vscode.window.showErrorMessage('No file to process.');
						return;
					} else {
						uri = activeTextEditor.document.uri;
					}
				}
				uris = [uri];
			}

			try {
				autoflakeRunner.runAutoflake(uris);
			}
			catch (e) {
				// print error message
				vscode.window.showErrorMessage((e as Error).message);
			}
		}
	);

	context.subscriptions.push(disposable);

	// For running autoflake for workspace folders
	disposable = vscode.commands.registerCommand(
		'autoflake-extension.runForWorkspaceFolders',
		async () => {
			const workspaceFolders = vscode.workspace.workspaceFolders;
			if (workspaceFolders === undefined) {
				vscode.window.showErrorMessage('No workspace has been opened.');
				return;
			}
			await vscode.commands.executeCommand('autoflake-extension.run', undefined, workspaceFolders.map(folder => folder.uri));
		}
	);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
