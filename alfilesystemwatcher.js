/** 
*@module al-file-system-watcher
*@description Supports a method to watch a particular directory for files with a particular extension.                 Any files that are added will be automatically read and uploaded to AwardLetter files API.
*
*By default, activity is logged to a file within ./logs/alfilesystemwatcher.log using
*nodejs winston module. This can be modified to log to numerous sources including a
*database or a SaaS logging product.
*   
*Note that this script expects any added files to be available in whole. When copying large files
*into the source directory, it is best to save it with an extension that is different from the
*watched extension. Once the file has been copied in full, rename the extension to the watched
*extension.
****
*### Environment Requirements:
*
** SSL access to the public internet over port 5443.
** Node.js installed.
*
*### Installing directly from github:
*
*Clone or download as zip to local machine. For the later, unzip to desired location.
*Install the following dependencies via npm (npm install [module-name]):
*
** chokidar
** winston
** oath-wrap
** al-files-service
** promise
*
*### Configuration:
*
*All configuration is contained within the config.json file.
*
***Logging:** The module is configured to log to a _logs_ folder within the root directory of the application.
*Standard log entries will be written to a file named alfilesystemwatcher.log while unhandled exceptions will
*be logged to a file named alfilesystemwatchererrors.log.
*
*       "logging" : { "directory" : "./logs" }
*
***Authorization:** The upload process requires an authorization token from a secure token service(STS).
*
*       "oauthWrapRequest" : { "url":"sts_url", "creds":{"uid":"userid", "pwd":"password"}, "wrapScope":"scope" }
*
*The following values must be provided in order to invoke the STS and acquire an authorization token:
*
*JSON Element | Description
*-------------|--------------------------------------------------------------------------
*url | The STS URL
*creds.userid | User Id
*creds.pwd | User password
*wrapScope | The resource that will be accessed using the authorization token.
*
***AwardLetter Files API:** Defines the root URL of the AwardLetter Files API. This API defines a method
*for uploading AwardLetter input file content.
*
*       "filesApi" : { "rootUrl" : "root_url" }
*
***Watch Settings:** Defines the directory to be watched, the file extension to look for, as well as the
*expected file format/extension.
*
*       "watch" : { "directory" : "./source", "extension" : "json", "fileFormat" : "txt" }
*
*###Running alfilesystemwatcher:
*
*From the alfilesystemwatcher root directory, execute the following in a command prompt:
*
*       node alfilesystemwatcher.js
*
*Alternatively, alfilesystemwatcher can be run as a daemon process using the nodejs forever module. 
*
** Install forever by executing "npm install forever -g" in a command prompt.
** Run alfilesystemwatcher using forever by executing "forever start alfilesystemwatcher.js" in a command prompt.
*
****
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
                var contentObject = content;
                try {
                    if (watchConfig.fileFormat === 'json') {
                        var contentObject = JSON.parse(content);
                    }
                } catch (error) {
                    logger.warn('Invalid JSON detected: ', error.stack);
                    return;  
                }

                oauth.getAuthHeader(oauthRequest.url,
                    oauthRequest.creds.uid,
                    oauthRequest.creds.pwd,
                    oauthRequest.wrapScope)
                    .then(function(authorization) {
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
                        filesService.upload(rootUrl, authorization, contentObject)
                            .then(function(result) { 
                                logger.debug('upload succeeded: ', result); 
                            })
                            .catch(function(error) {
                                logger.warn('error uploading file: ', error.stack);
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
        		} catch (error) {
        			logger.warn(error.stack);
                    return;
        		}
            }
        }) 
        .on('error', function(error) {
            logger.warn('chokidar error occurred: ', error.stack);
        })
};

watch(config);