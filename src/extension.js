"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const LoginPanel_1 = require("./panels/LoginPanel");
const SidebarProvider_1 = require("./SidebarProvider");
function activate(context) {
  const sidebarProvider = new SidebarProvider_1.SidebarProvider(
    context.extensionUri,
    context
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "purpletasks-sidebar",
      sidebarProvider
    )
  );
  // let disposable = vscode.commands.registerCommand("purpletasks.helloWorld", () => {
  //     vscode.window.showInformationMessage("Why are we still here? Just to suffer?");
  // });
  //   context.subscriptions.push(
  //     vscode.commands.registerCommand("purpletasks.showLoginPanel", () => {
  //       LoginPanel_1.LoginPanel.createOrShow(context.extensionUri);
  //     })
  //   );
  //   let refreshWebView = vscode.commands.registerCommand(
  //     "purpletasks.refreshWebView",
  //     () => {
  //         LoginPanel_1.LoginPanel.createOrShow(context.extensionUri);
  //         LoginPanel_1.LoginPanel.kill();
  //     }
  //   );

  //   context.subscriptions.push(refreshWebView);
  //   context.subscriptions.push(disposable);

  globalState.onDidChange("accessToken", () => {
    const token = globalState.get("accessToken");
    if (token) {
      // Show the tree view
      TreeView.show();
    } else {
      // Show the login form
      LoginPanel_1.LoginPanel.createOrShow(context.extensionUri);
    }
  });
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map
