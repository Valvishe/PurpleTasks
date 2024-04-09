(function () {
  const vscode = acquireVsCodeApi();

  console.log("start login");
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

        // console.log(data);

        vscode.postMessage({
          command: "storeToken",
          value: data.accessToken,
        });
      } catch (error) {
        console.log(error);
      }
    });
})();
