import * as vscode from "vscode";
import { SidebarProvider } from "./sidebar/SidebarProvider";
import { CourseTreeDataProvider } from "./treeViews/coursesTreeView";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri, context);

  let token = context.globalState.get("accessToken") as string;

  // if (token) {
  //   const courseTreeDataProvider = new CourseTreeDataProvider(context);
  //   const courseTreeView = vscode.window.createTreeView("courses", {
  //     treeDataProvider: courseTreeDataProvider,
  //   });
  //   context.subscriptions.push(courseTreeView);
  // } else {
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "purpletasks-sidebar",
        sidebarProvider
      )
    );
  // }
}

export function deactivate() {}
