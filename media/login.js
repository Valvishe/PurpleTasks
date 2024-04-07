(function () {
  const vscode = acquireVsCodeApi();

  console.log("start login");
//   document
//     .getElementById("login-form")
//     .addEventListener("submit", async (event) => {
//       event.preventDefault();
//       const username = document.getElementById("username").value;
//       const password = document.getElementById("password").value;

//       try {
//         const response = await fetch(
//           "https://lms.stage.purpleschool.purplecode.ru/api-v2/auth/login",
//           {
//             method: "POST",
//             body: JSON.stringify({ username, password }),
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await response.json();

//         console.log(data);

//         vscode.postMessage({
//           command: "storeTokens",
//           accessToken: data.accessToken,
//           refreshToken: data.refreshToken,
//         });
//       } catch (error) {
//         console.log(error);
//       }
//     });
})();
