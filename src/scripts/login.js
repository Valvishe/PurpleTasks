const vscode = acquireVsCodeApi();

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://app.purpleschool.ru/api-v2/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      vscode.postMessage({
        command: "setToken",
        token: data.access_token,
      });
    } catch (error) {
      vscode.postMessage({
        command: "onError",
        value: error,
      });
    }
  });
