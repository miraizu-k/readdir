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

        (function _scan(path) {
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

                        if (--length == 0) {
                            call();
                        }
                    });
                });
            });

        })((function (path) {
            // path normalized
            // TODO
            path = Path.resolve(Path.normalize(path));
            if (Path.existsSync(path) === false) {
                return null;
            }
            if (fs.lstatSync(path).isDirectory()) {
                return path;
            }
            return Path.dirname(path);
        })(filePath));
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
