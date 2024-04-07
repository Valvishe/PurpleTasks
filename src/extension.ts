import * as vscode from "vscode";
import { LoginPanel } from "./panels/LoginPanel";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "purpletasks.helloWorld",
    () => {
      vscode.window.showInformationMessage(
        "Why are we still here? Just to suffer?"
      );
    }
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("purpletasks.showLoginPanel", () => {
      LoginPanel.createOrShow(context.extensionUri);
    })
  );

  //   let refreshWebView = vscode.commands.registerCommand(
  //     "purpletasks.refreshWebView",
  //     () => {
  //       vscode.window.webview.postMessage({
  //         command: "refresh",
  //       });
  //     }
  //   );

  //   context.subscriptions.push(refreshWebView);

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
