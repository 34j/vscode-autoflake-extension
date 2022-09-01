// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { PythonTerminalProvider } from './terminalProvider';

/**
 * Runs autoflake.
 */
export class AutoflakeRunner {
    private terminalProvider: PythonTerminalProvider;

    constructor(teminalProvider: PythonTerminalProvider) {
        this.terminalProvider = teminalProvider;
    }


    /**
     * Whether the string is null or whitespace only.
     * @param str Input string.
     * @returns Whether the string is null or whitespace only.
     */
    private isNullOrWhitespace(str: string | undefined): boolean {
        return !str || !str.trim();
    }

    /**
     * Get the interpreter path for python.
     * @returns The interpreter path.
     */
    private getPythonInterpreterPath(): string {
        const interpreterPath = vscode.workspace.getConfiguration('python').get<string>('defaultInterpreterPath');
        if (interpreterPath === undefined) {
            throw new ReferenceError('No python interpreter configured');
        }
        return interpreterPath;
    }

    /**
     * Get command text to run in the terminal
     * @param pythonInterpreterPath Python Interpreter Path.
     * @param uris File paths and folder paths to run autoflake.
     * @returns command text
     */
    private getCommandText(pythonInterpreterPath: string, uris: vscode.Uri[]): string {
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
        let options: string[] = [pythonInterpreterPath, '-m', 'autoflake', '--recursive', '--in-place'];
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
        if (!this.isNullOrWhitespace(config.get('exclude'))) {
            options.push('--exclude=' + config.get('exclude'));
        }
        if (!this.isNullOrWhitespace(config.get('imports'))) {
            options.push('--imports=' + config.get('imports'));
        }

        options = options.concat(uris.map(uri => `"${uri.fsPath}"`));
        return options.join(' ');
    }

    /**
     * Run autoflake for the uris based on the configuration.
     * @param uris File paths and folder paths to run autoflake.
     */
    public async runAutoflake(uris: vscode.Uri[]) {
        vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: "Running autoflake" },
            async progress => {
                // Get python.defaultInterpreterPath
                const pythonInterpreterPath = this.getPythonInterpreterPath();
                const terminal = await this.terminalProvider.getTerminal();
                const commandText = this.getCommandText(pythonInterpreterPath, uris);
                terminal.sendText(commandText);
            });
    }
}


