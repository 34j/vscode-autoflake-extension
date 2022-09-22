import * as vscode from 'vscode';
import { IExtensionApi, getExtensionApi } from '../msPythonApi';
import * as child_process from "child_process";
import { IPythonTerminal } from './types';

/**
 * Provides a properly configured hidden terminal (child_process) for executing Python commands.
 */
export class PythonHiddenTerminal implements IPythonTerminal {
    private uri: vscode.Uri | undefined;
    private execCommand: string[] = [];
    private isInitialized: boolean = false;

    constructor(uri: vscode.Uri | undefined) {
        this.uri = uri;
    }

    private async init() {
        const api: IExtensionApi = await getExtensionApi();
        if (api) {
            const execCommand = api.settings.getExecutionDetails(this.uri).execCommand;
            if (execCommand) {
                this.execCommand = execCommand;
            }
            else {
                throw new Error("Python interpreter is not configured");
            }
        }
        else {
            throw new Error("Could not get python extension api");
        }
    }

    public async send(options: string[], addNewLine?: boolean) {
        if (!this.isInitialized) {
            await this.init();
            this.isInitialized = true;
        }
        options = this.execCommand.concat(options);
        console.log(options.join(" "));
        const child = child_process.spawn(options[0], options.slice(1), { shell: true });
        child.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        child.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            throw new Error(`stderr: ${data}`);
        });
        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}
