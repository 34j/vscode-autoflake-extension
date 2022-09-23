
/**
 * Provides a properly configured terminal for executing Python commands.
 */
export interface IPythonTerminal {
    /**
     * Send a command to the terminal.
     * @param options The options to send. (Must not include 'python' or the interpreter path.)
     * @param addNewLine Whether to add a new line to the end of the command. This option is only used for the VSCode terminal.
     */
    send(options: string[], addNewLine?: boolean): Promise<void>;
}
