(function () {
  const vscode = acquireVsCodeApi();

  const logButton = document.getElementById("log");

  //   const token = vscode.workspaceState.get("accessToken");

  //   vscode.workspaceState.update("accessToken", "token from js");

  //   logTokenButton.innerHTML = "token from js";

  logButton.innerHTML = "log from js";

  logButton.addEventListener("click", (e) => {
    // e.preventDefault();
    console.log("click");
  });

  console.log("start login");
  document
    .getElementById("loginForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      const loginButton = document.getElementById("login");
      loginButton.innerHTML = "logging...";
      username.value = "some username";

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

        console.log(data);

        vscode.postMessage({
          command: "storeTokens",
          accessToken: data.accessToken,
        });
      } catch (error) {
        console.log(error);
      }
    });
})();
