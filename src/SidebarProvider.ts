import * as vscode from "vscode";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _context: vscode.ExtensionContext;
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    this._context = context;
  }

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.comand) {
        case "onInfo": {
          if (!data.value) {
            return;
          }

          this._context.globalState.update("accessToken", data.value);

          vscode.window.showInformationMessage("Вы успешно авторизовались!");
          break;
        }
        case "exit": {
          this._context.globalState.update("accessToken", undefined);
          console.log("exit");
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
        case "storeToken": {
          console.log("fuck");
          if (!data) {
            return;
          }
          await this._context.globalState.update(
            "accessToken",
            data.accessToken
          );
          console.log("Token stored:", data.accessToken);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.

    const styleResetPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "reset.css"
    );
    const stylesPathMainPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "vscode.css"
    );
    const stylesPathLoginPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "login.css"
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(styleResetPath);
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
    const stylesLoginUri = webview.asWebviewUri(stylesPathLoginPath);

    //uri ro load script
    const loginScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "login.js")
    );

    const mainScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );

    // getTokens

    let token = this._context.globalState.get("accessToken");

    console.log(token + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

    if (!token) {
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
        <form id="loginForm">
            <input type="text" id="username" placeholder="Username" />
            <input type="password" id="password" placeholder="Password" />
            <button type="submit" id="login">Login</button>
        </form>
          <button  id="log">Log</button>

    </body>
        
        <script src="${loginScriptUri}"></script>

    </html>`;
    }

    if (token) {
      try {
      } catch (error) {}
    }

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
        <div class="login-container">
          <h1 class="title">Hello there!</h1>
          <button id="exit">Exit</button>
        </div>
    </body>
    <script src="${mainScriptUri}"></script>
    </html>`;
  }
}
