const fs = require('fs');
const https = require('https');

function download(url, filename) {
  https.get(url, (res) => {
    const file = fs.createWriteStream(filename);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  });
}

download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzM5NzE2MWIzMGRjODRmZjE4MDRjYWQ4MWZlNmVjOWVlEgsSBxDLzfaE9BYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTE5NzU2NDQ2ODY1NDUzNTI5OQ&filename=&opi=89354086', 'student_dashboard.html');
download('https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QwNTNiYjgzZGQ5NTRkZTM4NzIwZDIyZDljYjg2MDIwEgsSBxDLzfaE9BYYAZIBJAoKcHJvamVjdF9pZBIWQhQxMTE5NzU2NDQ2ODY1NDUzNTI5OQ&filename=&opi=89354086', 'index.html');
