module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            livereload: {
                options: { livereload: true },
                files: ['dest/**/*.html','dest/**/*.css','dest/**/*.js'],
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['newer:less', 'newer:concat', 'newer:htmlmin', 'newer:uglify', 'newer:merge-json', 'newer:jsonmin', 'uncss', 'cssmin']);
    grunt.registerTask('watchme', ['watch']);
};

/*
1. "newer:less"       -> Converting LESS file to CSS in folder /css;
2. "newer:concat"     -> Concatenating the JS and CSS files to only 1 file each, from folder /js and /css, and sending them to folder dest/deletable;
3. "newer:htmlmin"    -> Minifying the .html files and send them to folder /dest;
4. "newer:uglify"     -> Minifying the JS files from folder dest/deletable to folder dest/js;
5. "newer:merge-json" -> Merging JSON files to only 1 JSON file to folder /dest/resources/list.json;
6. "newer:jsonmin"    -> Minifying the JSON file;
7. "uncss"            -> Cleaning the CSS file from folder /dest/deletable/*.css to another file in the same folder tidy.css;
8. "cssmin"           -> Minifying the tidy CSS file; 

WATCH: will monitor for changes in all the files mentioned in the watch task, and will execute some task when changes were made to the monitored files;
NEWER: will only trigger a grunt task if the source file is newer than the destination files;

*/