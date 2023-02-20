document.addEventListener('DOMContentLoaded', function () {
  const { electronAPI } = window;

  document.getElementById('dodo').addEventListener('click', async () => {
    console.log("toto");
    electronAPI.openFile();
  })
})
