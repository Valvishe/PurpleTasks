const vscode = acquireVsCodeApi();

const logOutButton = document.getElementById("logOut");

logOutButton.addEventListener("click", () => {
  console.log("logOut");
  vscode.postMessage({
    command: "logOut",
  });
});
