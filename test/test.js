var readdir = require('readdir'),
    scanDir = function (path) {
        console.log("set read directory %s",path);
        readdir.scan(path,function (fileList) {
            console.log("%s file list start",path);
            fileList.forEach(function (file) {
                console.log(file);
            });
            console.log("%s file path scan done",path);
        });
    };

scanDir('');            // self directory
scanDir('/root');       // root user directory
scanDir('../');         // parent directory
scanDir(__dirname);     // self app directory
scanDir(__filename);     // self app directory
