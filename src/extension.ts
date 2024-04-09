import * as vscode from "vscode";
import { LoginPanel } from "./panels/LoginPanel";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "purpletasks-sidebar",
      sidebarProvider
    )
  );

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

  let refreshWebView = vscode.commands.registerCommand(
    "purpletasks.refreshWebView",
    () => {
      LoginPanel.kill();
      LoginPanel.createOrShow(context.extensionUri);
    }
  );

  context.subscriptions.push(refreshWebView);

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
