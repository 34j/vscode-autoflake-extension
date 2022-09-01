import * as vscode from 'vscode';
/**
 * Provides a properly configured terminal for executing Python commands.
 */
export class PythonTerminalProvider {
    private terminal: vscode.Terminal | undefined;

    /**
     * Get a properly configured terminal for executing Python commands.
     * @returns The configured terminal.
     */
    public async getTerminal() {
        // For terminal api, See: https://github.com/Tyriar/vscode-terminal-api-example/blob/master/src/extension.ts
        // Open terminal if not already opened or not active
        // exitStatus === undefined if terminal is still alive.
        if (this.terminal === undefined || this.terminal.exitStatus !== undefined) {
            // There should be a better way than creating new terminal every time
            // There is no way to get terminal output unless we are using vscode api, therefore we don't know if 
            // the terminal is propertly configured (e.g. activating venv) 
            await vscode.commands.executeCommand('python.createTerminal');
            this.terminal = vscode.window.activeTerminal;
            if (this.terminal === undefined) {
                throw new Error("Could not create terminal. Did you install VSCode Python extension?");
                // But it should be installed because we have set "extensionDependencies" in package.json.
            }
        }
        return this.terminal;
    }
}