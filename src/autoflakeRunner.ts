// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IPythonTerminal } from './pythonTerminal/types';

/**
 * Runs autoflake.
 */
export class AutoflakeRunner {
    private terminal: IPythonTerminal;

    constructor(terminal: IPythonTerminal) {
        this.terminal = terminal;
    }

    /**
     * Get command text to run in the terminal
     * @param pythonInterpreterPath Python Interpreter Path.
     * @param uris File paths and folder paths to run autoflake.
     * @returns command text
     */
    private getOptions(uris: vscode.Uri[]): string[] {
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
        let options: string[] = ['-m', 'autoflake', '--recursive', '--in-place'];
        for (const flag of flags) {
            if (config.get<boolean>(flag)) {
                options.push('--' + flag);
            }
        }

        // numbers
        const jobs = config.get<number>('jobs');
        if (jobs && Number.isInteger(jobs) && jobs > 0) {
            options.push('--jobs=' + config.get('jobs'));
        }
        else if (jobs === 0){

        }
        else{
            vscode.window.showWarningMessage('autoflake-extension.jobs must be non-negative integer. Skipping this option.');
        }

        // string arrays
        const excludes = config.get<[]>('exclude');
        if (!excludes || !excludes.every(x => typeof x === 'string')){
            vscode.window.showWarningMessage('autoflake-extension.excludes contains non-string elements. Skipping this option.');
        }
        else if (excludes.length > 0) {
            options.push('--exclude="' + excludes.join(',') + '"');
        }

        const imports = config.get<string[]>('imports');
        if (!imports || !imports.every(x => typeof x === 'string')){
            vscode.window.showWarningMessage('autoflake-extension.imports contains non-string elements. Skipping this option.');
        }
        else if (imports.length > 0) {
            options.push('--imports="' + imports.join(',') + '"');
        }

        // To support bash, enclose file paths in quotes.
        options = options.concat(uris.map(uri => `"${uri.fsPath}"`));
        return options;
    }

    //https://github.com/microsoft/vscode-python/blob/3698950c97982f31bb9dbfc19c4cd8308acda284/src/client/common/process/proc.ts
    //Using child_process
    /**
     * Run autoflake for the uris based on the configuration.
     * @param uris File paths and folder paths to run autoflake.
     */
    public async runAutoflake(uris: vscode.Uri[]) {
        vscode.window.withProgress(
            { location: vscode.ProgressLocation.Notification, title: "Running autoflake" },
            async progress => {
                const command = this.getOptions(uris);
                this.terminal.send(command);
            });
    }
}


