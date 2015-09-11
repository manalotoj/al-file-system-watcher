// filename: al-file-system-watcher.js

/** 
* @module al-file-system-watcher 
* @description Supports a method to watch a particular directory for files with a particular extension.
*   Any files that are added will be automatically read and uploaded to AwardLetter files API.
*
*   By default, activity is logged to a file within ./logs/alfilesystemwatcher.log using
*   nodejs winston module. This can be modified to log to numerous sources including a
*   database or a SaaS logging product.
*   
*   Note that this script expects any added files to be available in whole. When copying large files
*   into the source directory, it is best to save it with an extension that is different from the
*   watched extension. Once the file has been copied in full, rename the extension to the watched
*   extension.
*
*   Environment Requirements:
*
*   - SSL access to the public internet over port 5443.
*   - Node.js installed.
*
*   Installing directly from github:
*
*   - Clone or download as zip to local machine. For the later, unzip to desired location.
*   - Install the following dependencies via npm (npm install [module-name]):
*       - chokidar
*       - winston
*       - oath-wrap
*       - al-files-service
        - promise
*
*   Running al-file-system-watcher:
*/

'use strict';

// module dependencies
var pathModule = require('path');
var promise = require('promise');

// coerce fs to return promises
var readFile = promise.denodeify(require('fs').readFile);

// additional module dependencies
var logger = require('./logger');
var oauth = require('oauth-wrap');
var filesService = require('al-files-service');
var chokidar = require('chokidar');

// configuration
var config = require('./config');

/**
*   Automatically upload files that are created within a designated source directory.
*   @param {object} config Contains values for 1) directory to watch and 2) file extension to watch.
*/
function watch(config) {    
    var rootUrl = config.filesApi.rootUrl;
    var watchConfig = config.watch;
    var oauthRequest = config.oauthWrapRequest;

    var watcher = chokidar.watch(watchConfig.directory, {ignored: /[\/\\]\./, persistent: true});

    var authorization = null;

    function upload(path) {
        readFile(path, 'utf8')            
            .then(function(content) {
                var jsonObject = null;
                try {
                    var jsonObject = JSON.parse(content);
                } catch (e) {
                    logger.warn('Invalid JSON detected: ', e);
                    return;  
                }

                oauth.getAuthHeader(oauthRequest.url,
                    oauthRequest.creds.uid,
                    oauthRequest.creds.pwd,
                    oauthRequest.wrapScope)
                    .then(function(authorization) {
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                        filesService.upload(rootUrl, authorization, jsonObject)
                            .then(function(result) { 
                                logger.debug('upload succeeded: ', result); 
                            })
                            .catch(function(error) {
                                logger.warn('error uploading file: ', error);
                            });
                    })
                    .catch(function(error) {                        
                        logger.warn('error requesting authorization: ', error.stack);
                    });                    
            })
            .catch(function(error) {
                logger.warn('error reading file: ', error.stack);
            });
    }

    watcher
        .on('add', function(path) 
        {
            if (pathModule.extname(path) === '.' + watchConfig.extension) {
            	try {            		
                    upload(path);
                    logger.debug('file ext match', path);
        		} catch (exc) {
        			logger.warn(exc);
                    return;
        		}
            }
        }) 
        .on('error', function(error) {
            logger.warn('chokidar error occurred: ', error);
        })
};

watch(config);