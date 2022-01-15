// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { composeHTML } from './html';

let singlePanel: vscode.WebviewPanel | undefined;
let panels: vscode.WebviewPanel[] = [];
const webviewConfigKey = 'reg-visualizer.webview-mode';
let webviewMode = vscode.workspace.getConfiguration('reg-visualizer').get('webview-mode');

const clearPanels = () => {
  singlePanel?.dispose();
  panels.forEach((item) => item.dispose());
};

const createWebviewPanel = (text: string, single: boolean, context: vscode.ExtensionContext) => {
  const panel = vscode.window.createWebviewPanel(
    'RegVisualizer',
    'Visualize RegExp',
    vscode.ViewColumn.Two,
    {
      enableScripts: true,
      retainContextWhenHidden: false,
    },
  );

  panel.onDidDispose(
    () => {
      if (single) singlePanel = undefined;
      else {
        panels = panels.filter((p) => p !== panel);
        console.info(`panel item dispose`);
      }
    },
    null,
    context.subscriptions,
  );

  const config = vscode.workspace.getConfiguration('reg-visualizer');
  const hideHeader: boolean | undefined = config.get('hide-header');
  const hideFooter: boolean | undefined = config.get('hide-footer');
  const hideFork: boolean | undefined = config.get('hide-fork');

  panel.webview.html = composeHTML(text, { hideHeader, hideFooter, hideFork });

  return panel;
};

export function activate(context: vscode.ExtensionContext) {
  /** handle config change */
  const cfgDisposable = vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration(webviewConfigKey)) {
      webviewMode = vscode.workspace.getConfiguration('reg-visualizer').get('webview-mode');
      clearPanels();
    }
  });

  /** unwrap reg text and excape backquota if need */
  const processRegText = (text: string) => {
    let finalReg = text.trim();
    const wrapedWithDoubleSlash = finalReg.startsWith('/') && finalReg.endsWith('/');
    if (wrapedWithDoubleSlash) finalReg = finalReg.replace(/^\/|\/$/g, '');
    return finalReg.replace(/`/g, '\\`');
  };

  /** core logic */
  const mainDisposable = vscode.commands.registerCommand('reg-visualizer.visualize', async () => {
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.selection;

    let regText: string | undefined;

    if (selection) {
      if (!selection.isSingleLine) {
        return vscode.window.showErrorMessage('Multi lines regexp are not supported.');
      }
      if (!selection.isEmpty) regText = editor.document.getText(selection);
    }

    // if user not select a reg, ask him to input one
    if (!regText) {
      regText = await vscode.window.showInputBox({
        prompt: 'Please input the regexp.',
        value: '',
        ignoreFocusOut: false,
      });
    }

    if (!regText) return;

    regText = processRegText(regText);
    console.info(regText);

    if (webviewMode === 'single') {
      if (singlePanel) singlePanel.webview.postMessage({ type: 'reg', regText });
      else singlePanel = createWebviewPanel(regText, true, context);
    } else {
      const newPanel = createWebviewPanel(regText, false, context);
      panels.push(newPanel);
    }
  });

  context.subscriptions.push(cfgDisposable);
  context.subscriptions.push(mainDisposable);
}

export function deactivate() {
  clearPanels();
}
