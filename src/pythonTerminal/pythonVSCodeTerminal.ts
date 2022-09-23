import * as vscode from 'vscode';
import assert = require('assert');
import { IPythonTerminal } from './types';

/**
 * Provides a properly configured vscode terminal for executing Python commands.
 */

export class PythonVSCodeTerminal implements IPythonTerminal {
    private terminal: vscode.Terminal | undefined;
    private execCommand: string[] = [];

    /**
     * Get the interpreter path for python.
     * @returns The interpreter path.
     */
    private getPythonInterpreterPath(): string {
        const interpreterPath = vscode.workspace.getConfiguration('python').get<string>('defaultInterpreterPath');
        if (!interpreterPath) {
            throw new ReferenceError('No python interpreter configured.');
        }
        return interpreterPath;
    }

    /**
     * Get a properly configured terminal for executing Python commands.
     * @returns The configured terminal.
     */
    private async init() {
        // For terminal api, See: https://github.com/Tyriar/vscode-terminal-api-example/blob/master/src/extension.ts
        // Open terminal if not already opened or not active
        // exitStatus === undefined if terminal is still alive.
        if (!this.terminal || this.terminal.exitStatus !== undefined) {
            // There should be a better way than creating new terminal every time
            // There is no way to get terminal output unless we are using vscode api, therefore we don't know if 
            // the terminal is propertly configured (e.g. activating venv) 
            await vscode.commands.executeCommand('python.createTerminal');
            this.terminal = vscode.window.activeTerminal;
            if (!this.terminal) {
                throw new Error("Could not create terminal. Did you install VSCode Python extension?");
                // But it should be installed because we have set "extensionDependencies" in package.json.
            }
        }
    }

    public async send(options: string[], addNewLine?: boolean) {
        if (!this.terminal) {
            await this.init();
            this.execCommand = this.getPythonInterpreterPath().split(' ');
        }
        assert(this.terminal);

        const command = this.execCommand.concat(options);
        this.terminal.sendText(command.join(" "), addNewLine);
    }
}
