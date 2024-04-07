"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPanel = void 0;
const vscode = __importStar(require("vscode"));
// import { accessTokenKey, apiBaseUrl, refreshTokenKey } from "./constants";
// import { flairMap, FlairProvider } from "./FlairProvider";
// import { getNonce } from "./getNonce";
// import { mutationNoErr } from "./mutation";
// import { Util } from "./Util";
class LoginPanel {
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    static currentPanel;
    static viewType = "login";
    _panel;
    _extensionUri;
    _disposables = [];
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (LoginPanel.currentPanel) {
            LoginPanel.currentPanel._panel.reveal(column);
            LoginPanel.currentPanel._update();
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(LoginPanel.viewType, "Login", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        LoginPanel.currentPanel = new LoginPanel(panel, extensionUri);
    }
    static kill() {
        LoginPanel.currentPanel?.dispose();
        LoginPanel.currentPanel = undefined;
    }
    static revive(panel, extensionUri) {
        LoginPanel.currentPanel = new LoginPanel(panel, extensionUri);
    }
    constructor(panel, extensionUri) {
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }
    dispose() {
        LoginPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                // case "report": {
                //   const message = await vscode.window.showInputBox({
                //     placeHolder: "why are you reporting this user?",
                //   });
                //   if (message) {
                //     await mutationNoErr(`/report`, { message, ...data.value });
                //     webview.postMessage({
                //       command: "report-done",
                //       data,
                //     });
                //     vscode.window.showInformationMessage("Thank you for reporting!");
                //   }
                //   break;
                // }
                // case "set-window-info": {
                //   const { displayName, flair } = data.value;
                //   this._panel.title = displayName;
                //   if (flair in flairMap) {
                //     const both = vscode.Uri.parse(
                //       `https://flair.benawad.com/` +
                //         flairMap[flair as keyof typeof flairMap]
                //     );
                //     this._panel.iconPath = {
                //       light: both,
                //       dark: both,
                //     };
                //   }
                //   break;
                // }
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
                // case "tokens": {
                //   await Util.globalState.update(accessTokenKey, data.accessToken);
                //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
                //   break;
                // }
            }
        });
    }
    _getHtmlForWebview(webview) {
        // // // And the uri we use to load this script in the webview
        // const scriptUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.js")
        // );
        // Local path to css styles
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, "media", "reset.css");
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css");
        const stylesPathLoginPath = vscode.Uri.joinPath(this._extensionUri, "media", "login.css");
        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        const stylesLoginUri = webview.asWebviewUri(stylesPathLoginPath);
        //uri ro load scripts
        const sampleScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "main.js"));
        const loginScriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "login.js"));
        // const cssUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
        // );
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${stylesResetUri}" rel="stylesheet">
        <link href="${stylesMainUri}" rel="stylesheet">
        <link href="${stylesLoginUri}" rel="stylesheet">

    </head>
    <body>
    <div class="login-container"></div>
        <h1 class="title">Login</h1>
        <form class="login-form">
            <input type="text" id="username" placeholder="Username" />
            <input type="password" id="password" placeholder="Password" />
            <button type="submit" id="login">Login</button>
        </form>

        <button id="log">log token</button>

    </body>
        
        <script src="${loginScriptUri}"></script>

    </html>`;
    }
}
exports.LoginPanel = LoginPanel;
//# sourceMappingURL=LoginPanel.js.map