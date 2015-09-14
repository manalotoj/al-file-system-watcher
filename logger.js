/**
*	@module logger
*	@description A singleton logger module that uses winston under the covers (copied from: http://thottingal.in/blog/2014/04/06/winston-nodejs-logging/). Use standard winston syntax to create log entries (ex. logger.debug, logger.warn etc.)
*/

'use strict';

var winston = require( 'winston' ),
	config = require('./config').logging,
	logDir = config.directory,
	fs = require( 'fs' ),
	env = process.env.NODE_ENV || 'development',
	logger;

winston.setLevels( winston.config.npm.levels );
winston.addColors( winston.config.npm.colors );

if ( !fs.existsSync( logDir ) ) {
	// Create the directory if it does not exist
	fs.mkdirSync( logDir );
}

logger = new( winston.Logger )( {
	transports: [
		new winston.transports.Console( {
			level: 'silly',
			colorize: true
		} ),
		new winston.transports.File( {
			level: env === 'development' ? 'debug' : 'info',
			filename: logDir + '/alfilesystemwatcher.log',
			maxsize: 1024 * 1024 * 10 // 10MB
		} )
    ],
    handleExceptions: true,
	exceptionHandlers: [
		new winston.transports.File( {
			filename: logDir + '/alfilesystemwatchererrors.log',
			maxsize: 1024 * 1024 * 10 // 10MB
		} )
    ]
} );
logger.exitOnError = false;

module.exports = logger;