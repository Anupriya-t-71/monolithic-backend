import http from "http"
import fs from "fs"
import formidable from "formidable";

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = formidable();
    form.parse(req, function (err, fields, files) {
        console.log(files.filetoupload.filepath)
      var oldpath = files.filetoupload.filepath;
      var newpath = 'C:/Users/Your Name/' + files.filetoupload.originalFilename;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);