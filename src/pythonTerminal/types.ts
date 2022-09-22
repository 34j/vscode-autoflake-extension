
/**
 * Provides a properly configured terminal for executing Python commands.
 */
export interface IPythonTerminal {
    send(options: string[], addNewLine?: boolean): Promise<void>;
}
