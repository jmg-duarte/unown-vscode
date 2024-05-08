import * as vscode from 'vscode';

let unownViewer: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	unownViewer = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 500);
	unownViewer.name = "Unown";

	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem));

	updateStatusBarItem();
}

function updateStatusBarItem(): void {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		unownViewer.hide();
		return;
	}

	const document = editor.document;
	const selection = editor.selection;
	const pos = selection.active;

	// NOTE(jmg-duarte): it does not support UTF-8 Grapheme clusters
	// https://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundary_Rules
	let ch = document.getText(new vscode.Range(pos, pos.translate(0, 1)));
	if (ch === '') {
		ch = document.getText(new vscode.Range(pos, pos.translate(1, 0).with(undefined, 0)));
	}

	unownViewer.text = `UTF-8: ${ch.charCodeAt(0)}`;
	unownViewer.show();
}
