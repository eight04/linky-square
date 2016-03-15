/* eslint-env node */

module.exports = function(grunt) {

	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		eslint: {
			target: ["src/*.js"]
		},
		watch: {
			grunt: {
				files: ["Gruntfile.js"],
				tasks: ["default"]
			},
			src: {
				files: ["src/*"],
				tasks: ["default"]
			}
		},
		replace: {
			js: {
				options: {
					patterns: [{
						match: /REPLACE\.(\w+)/g,
						replacement: function(match, name) {
							switch(name) {
								case "CSS":
									return JSON.stringify(grunt.file.read("temp/style.css"));
							}
						}
					}],
					usePrefix: false
				},
				files: [{
					expand: true,
					cwd: "src",
					dest: "dist",
					src: "*.js"
				}]
			}
		},
		cssmin: {
			target: {
				"temp/style.css": ["src/style.css"]
			}
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-eslint');

	// Tasks
	grunt.registerTask("default", ["eslint", "cssmin", "replace"]);
};
