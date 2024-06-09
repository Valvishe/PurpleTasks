import * as vscode from "vscode";
import { getCourses } from "../api/getCourses";

export class SidebarProvider implements vscode.WebviewViewProvider {
  private _context: vscode.ExtensionContext;
  _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    this._context = context;
  }

  public async resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    const token = this._context.globalState.get("accessToken") as string | null;

    webviewView.webview.html = token
      ? await this.showCourses(webviewView.webview)
      : this.showLoginForm(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(
      async (data: { command: string; value: string; token?: string }) => {
        switch (data.command) {
          case "setToken": {
            if (!data.token) {
              return;
            }
            this._context.globalState.update("accessToken", data.token);
            vscode.window.showInformationMessage("Вы успешно авторизовались!");

            webviewView.webview.html = await this.showCourses(
              webviewView.webview
            );

            break;
          }
          case "onError": {
            vscode.window.showErrorMessage(data.value);
            break;
          }
          case "logOut": {
            this._context.globalState.update("accessToken", null);
            webviewView.webview.html = await this.showLoginForm(
              webviewView.webview
            );
            break;
          }
        }
      }
    );
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private async showCourses(webview: vscode.Webview) {
    const sentCoursesToWebView = async () => {
      const courses = await getCourses(
        this._context.globalState.get("accessToken") as string
      ).then(
        (courses) => courses,
        (error) => {
          vscode.window.showErrorMessage(error);
        }
      );

      if (courses) {
        const coursesList = courses
          .map((course) => `<li>${course.rest.title}</li>`)
          .join("");

        return coursesList;
      }
    };

    const coursesList = await sentCoursesToWebView();

    const styleResetPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "styles",
      "reset.css"
    );
    const stylesPathMainPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "styles",
      "vscode.css"
    );
    const stylesPathLoginPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "styles",
      "login.css"
    );

    const courseListScripPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "scripts",
      "couseList.js"
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(styleResetPath);
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
    const stylesLoginUri = webview.asWebviewUri(stylesPathLoginPath);

    const courseListScriptUri = webview.asWebviewUri(courseListScripPath);

    return ` <!DOCTYPE html>
      <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${stylesResetUri}" rel="stylesheet">
            <link href="${stylesMainUri}" rel="stylesheet">
            <link href="${stylesLoginUri}" rel="stylesheet">
            <script type="text/javascript" async="async" src="${courseListScriptUri}"></script>
        </head>
        <body>
          <h1 class="title">Курсы</h1>
          <ul class="coursesList">
            ${coursesList}
          </ul>
          <button id="logOut">LogOut</button>
          <script type="text/javascript" async="async" src="${courseListScriptUri}"></script>
        </body>
      </html>`;
  }

  private showLoginForm(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.

    const styleResetPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "styles",
      "reset.css"
    );
    const stylesPathMainPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "styles",
      "vscode.css"
    );
    const stylesPathLoginPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "styles",
      "login.css"
    );

    const loginScriptPath = vscode.Uri.joinPath(
      this._extensionUri,
      "src",
      "scripts",
      "login.js"
    );

    // Uri to load styles into webview
    const stylesResetUri = webview.asWebviewUri(styleResetPath);
    const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
    const stylesLoginUri = webview.asWebviewUri(stylesPathLoginPath);

    const loginScriptUri = webview.asWebviewUri(loginScriptPath);

    return ` <!DOCTYPE html>
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
          <script type="text/javascript" async="async" src="${loginScriptUri}"></script>
        </body>
      </html>`;
  }
}
