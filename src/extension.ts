// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let terminal: vscode.Terminal | undefined = undefined;
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autoflake-extension" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('autoflake-extension.run', async (uri?: vscode.Uri) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.withProgress(
			{ location: vscode.ProgressLocation.Notification, title: "Running autoflake" },
			async progress => {
				// Get python.defaultInterpreterPath
				const pythonPath = vscode.workspace.getConfiguration('python').get<string>('defaultInterpreterPath');
				if (pythonPath === undefined) {
					vscode.window.showErrorMessage('No python interpreter configured');
					return;
				}

				// Create command text
				// For list of autoflake options, See: https://github.com/PyCQA/autoflake#advanced-usage
				const config = vscode.workspace.getConfiguration('autoflake-extension');
				// flags
				const flags: string[] = [
					'check',
					'expand-star-imports',
					'remove-all-unused-imports',
					'ignore-init-module-imports',
					'remove-duplicate-keys',
					'remove-unused-variables',
					'remove-rhs-for-unused-variables',
				];
				let options: string[] = [pythonPath, '-m', 'autoflake', '--recursive', '--in-place'];
				for (const flag of flags) {
					if (config.get(flag) === true) {
						options.push('--' + flag);
					}
				}

				// numbers
				if (config.get('jobs') !== 0) {
					options.push('--jobs=' + config.get('jobs'));
				}

				// strings
				function isNullOrWhitespace(input: string | undefined) {
					return !input || !input.trim();
				}
				if (!isNullOrWhitespace(config.get('exclude'))) {
					options.push('--exclude=' + config.get('exclude'));
				}
				if (!isNullOrWhitespace(config.get('imports'))) {
					options.push('--imports=' + config.get('imports'));
				}

				// if called from Command Palette, use the current file
				if (uri === undefined) {
					const activeTextEditor = vscode.window.activeTextEditor;
					if (activeTextEditor === undefined) {
						vscode.window.showErrorMessage('No file to process');
						return;
					} else {
						uri = activeTextEditor.document.uri;
					}
				}
				options.push(uri.fsPath);

				// For terminal api, See: https://github.com/Tyriar/vscode-terminal-api-example/blob/master/src/extension.ts
				// Open terminal if not already opened or not active
				// exitStatus === undefined if terminal is still alive.
				if (terminal === undefined || terminal.exitStatus !== undefined) {
					// There should be a better way than creating new terminal every time
					// There is no way to get terminal output unless we are using vscode api, therefore we don't know if 
					// the terminal is propertly configured (e.g. activating venv) 
					await vscode.commands.executeCommand('python.createTerminal');
					terminal = vscode.window.activeTerminal;
					if (terminal === undefined) {
						vscode.window.showErrorMessage('Could not create terminal');
						return;
					}
				}
				terminal.sendText(options.join(' '));
			});
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
