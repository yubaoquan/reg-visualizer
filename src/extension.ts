// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { composeHTML } from './html';

export function activate(context: vscode.ExtensionContext) {
  const createWebviewPanel = (text: string) => {
    const panel = vscode.window.createWebviewPanel(
      'RegVisualizer',
      'Visualize RegExp',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: false,
      },
    );

    console.info('createWebviewPanel');

    // const jsPath = vscode.Uri.joinPath(context.extensionUri, 'src/reg.js');
    // const scriptUri = panel.webview.asWebviewUri(jsPath).toString();

    panel.webview.html = composeHTML(text);

    return panel;
  };

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "reg-visualizer" is now active!');

  const disposable = vscode.commands.registerCommand('reg-visualizer.visualize', () => {
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.selection;
    console.info(selection);

    if (!selection) return vscode.window.showErrorMessage('Please select a regexp first.');
    if (!selection.isSingleLine) {
      return vscode.window.showErrorMessage('Multi lines regexp are not supported.');
    }

    const selectedText = editor.document.getText(selection);
    console.info(selectedText);
    vscode.window.showInformationMessage(`visualize working ${selectedText}`);
    createWebviewPanel(selectedText);
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
