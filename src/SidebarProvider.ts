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

    let token = this._context.globalState.get("accessToken");

    if (token) {
      webviewView.webview.postMessage({
        command: "token",
        value: token,
      });
    }

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      console.log(data);
      vscode.window.showInformationMessage(data.value);
      switch (data.comand) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }

        case "onError": {
          // if (!data.value) {
          //   return;
          // }
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
    const mainScriptPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "main.js"
    );
    const loginScriptPath = vscode.Uri.joinPath(
      this._extensionUri,
      "media",
      "login.js"
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(styleResetPath);
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
    const stylesLoginUri = webview.asWebviewUri(stylesPathLoginPath);

    //uri ro load script
    const mainScriptUri = webview.asWebviewUri(mainScriptPath);

    const loginScriptUri = webview.asWebviewUri(loginScriptPath);

    // const nonce = getNonce();

    const getLoginForm = () => {
      return `
      <!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="${stylesResetUri}" rel="stylesheet">
              <link href="${stylesMainUri}" rel="stylesheet">
              <link href="${stylesLoginUri}" rel="stylesheet">
              <script type="text/javascript" async="async" src="${loginScriptUri}"></script>
          

          </head>
          <body>
            <h1 class="title">Login</h1>
            <form id="loginForm">
                <input type="text" id="username" placeholder="Username" />
                <input type="password" id="password" placeholder="Password" />
                <button type="submit" id="login">Login</button>
            </form>
                <button  id="log">log3</button>
              <script type="text/javascript" async="async" src="${loginScriptUri}"></script>
                </body>
          </html>`;
    };

    const getMainPage = () => {
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
      <h1 class="title">Hello there!</h1>
      <button id="exit">Exit</button>
      </body>
      </html>`;
    };
    // <script src="${mainScriptUri}"></script>

    // getTokens
    let token = this._context.globalState.get("accessToken");

    if (token && this._view) {
      this._view.webview.html = getMainPage();
    }

    if (!token && this._view) {
      this._view.webview.html = getLoginForm();
    }

    webview.onDidReceiveMessage(async (data) => {
      switch (data.comand) {
        case "setToken": {
          console.log(data);
          if (!data.value) {
            return;
          }

          await this._context.globalState.update("accessToken", data.value);

          if (this._view) {
            this._view.webview.html = getMainPage();
          }

          vscode.window.showInformationMessage("Вы успешно авторизовались!");
          break;
        }
        case "exit": {
          await this._context.globalState.update("accessToken", undefined);
          if (this._view) {
            this._view.webview.html = getLoginForm();
          }
        }
      }
    });

    return (
      this._view?.webview.html ||
      `<!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${stylesResetUri}" rel="stylesheet">
            <link href="${stylesMainUri}" rel="stylesheet">
            <link href="${stylesLoginUri}" rel="stylesheet">
          

        </head>
        <body>
          <h1 class="title">Something wrong</h1>
      </body>
    </html>`
    );
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
