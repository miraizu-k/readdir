var fs = require('fs'),
    Path = require('path'),
    pathJoin = Path.join,
    scanDir = function (filePath,callback) {
        var fileList = [],
            counter = 0,
            call = function () {
                if (--counter === 0) {
                    fileList.sort();
                    callback(fileList);
                }
            };

        (function (callback) {
            filePath = Path.resolve(Path.normalize(filePath));
            Path.exists(filePath,function (exists) {
                if (exists === false) {
                    return callback(null);
                }
                
                fs.lstat(filePath,function (err,stat) {
                    if (stat.isDirectory()) {
                        return callback(filePath);
                    }
                    return callback(Path.dirname(filePath));
                });

            });
        })(function _scan(path) {
            if (path === null) {
                return call();
            }
            counter++;
            fs.readdir(path,function (err,files) {
                if (err) {
                    return call();
                }
                var length = files.length;
                if (length === 0) {
                    return call();
                }

                files.forEach(function (file) {
                    var fullPath = pathJoin(path,file);

                    fs.lstat(fullPath,function (err,stat) {
                        if (err) {
                            return call();
                        }
                        if (stat.isFile() || stat.isDirectory()) {
                            if (stat.isDirectory()) {
                                fullPath = pathJoin(fullPath,'d').slice(0,-1);
                                _scan(fullPath);
                            }
                            fileList.push(fullPath);
                        }

                        if (--length === 0) {
                            call();
                        }
                    });
                });
            });
        });
    };

if (require.main === module) {
    scanDir(__dirname,function (files) {
        files.forEach(function (file) {
            console.log(file);
        });
    });
}
else {
    exports.scan = scanDir;
}
