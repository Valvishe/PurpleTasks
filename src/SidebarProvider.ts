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
      switch (data.type) {
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

    // getTokens

    let savedToken = this._context.globalState.get("accessToken");

    console.log(
      savedToken +
        "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    );

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

    </body>
        
        <script src="${loginScriptUri}"></script>

    </html>`;
  }
}
