(function () {
  const vscode = acquireVsCodeApi();

  const exitButton = document.getElementById("exit");
  const handleExit = () => {
    vscode.postMessage({ comand: "exit" });
  };

  exitButton.addEventListener("click", handleExit);
})();
