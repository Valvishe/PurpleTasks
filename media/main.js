(function () {
  console.log(
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  );
  const vscode = acquireVsCodeApi();

  let token;

  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
      case "setToken":
        token = message.token;

        break;
    }
  });

  const button = document.getElementById("log");
  button.addEventListener("click", () => {
    console.log("somethong");
  });
  button.innerHTML = "text from js";

  const exitButton = document.getElementById("exit");
  const handleExit = () => {
    vscode.postMessage({ comand: "exit" });
    console.log("exit");
  };

  exitButton.addEventListener("click", handleExit);
})();
