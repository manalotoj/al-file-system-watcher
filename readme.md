## Modules
<dl>
<dt><a href="#module_al-file-system-watcher">al-file-system-watcher</a></dt>
<dd><p>Supports a method to watch a particular directory for files with a particular extension.
  Any files that are added will be automatically read and uploaded to AwardLetter files API.</p>
<p>  By default, activity is logged to a file within ./logs/alfilesystemwatcher.log using
  nodejs winston module. This can be modified to log to numerous sources including a
  database or a SaaS logging product.</p>
<p>  Note that this script expects any added files to be available in whole. When copying large files
  into the source directory, it is best to save it with an extension that is different from the
  watched extension. Once the file has been copied in full, rename the extension to the watched
  extension.</p>
<p>  Environment Requirements:</p>
<ul>
<li>SSL access to the public internet over port 5443.</li>
<li><p>Node.js installed.</p>
<p>Installing directly from github:</p>
</li>
<li><p>Clone or download as zip to local machine. For the later, unzip to desired location.</p>
</li>
<li><p>Install the following dependencies via npm (npm install [module-name]):</p>
<ul>
<li>chokidar</li>
<li>winston</li>
<li>oath-wrap</li>
<li>al-files-service<ul>
<li>promise</li>
</ul>
</li>
</ul>
<p>Running al-file-system-watcher:</p>
</li>
</ul>
</dd>
<dt><a href="#module_logger">logger</a></dt>
<dd><p>a singleton logger module that uses winston under the covers 
                    (copied from: <a href="http://thottingal.in/blog/2014/04/06/winston-nodejs-logging/">http://thottingal.in/blog/2014/04/06/winston-nodejs-logging/</a>).
                    Use standard winston syntax to create log entries (ex. logger.debug, logger.warn etc.)</p>
</dd>
</dl>
<a name="module_al-file-system-watcher"></a>
## al-file-system-watcher
Supports a method to watch a particular directory for files with a particular extension.
  Any files that are added will be automatically read and uploaded to AwardLetter files API.

  By default, activity is logged to a file within ./logs/alfilesystemwatcher.log using
  nodejs winston module. This can be modified to log to numerous sources including a
  database or a SaaS logging product.
  
  Note that this script expects any added files to be available in whole. When copying large files
  into the source directory, it is best to save it with an extension that is different from the
  watched extension. Once the file has been copied in full, rename the extension to the watched
  extension.

  Environment Requirements:

  - SSL access to the public internet over port 5443.
  - Node.js installed.

  Installing directly from github:

  - Clone or download as zip to local machine. For the later, unzip to desired location.
  - Install the following dependencies via npm (npm install [module-name]):
      - chokidar
      - winston
      - oath-wrap
      - al-files-service
        - promise

  Running al-file-system-watcher:

<a name="module_al-file-system-watcher..watch"></a>
### al-file-system-watcher~watch(config)
Automatically upload files that are created within a designated source directory.

**Kind**: inner method of <code>[al-file-system-watcher](#module_al-file-system-watcher)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Contains values for 1) directory to watch and 2) file extension to watch. |

<a name="module_logger"></a>
## logger
a singleton logger module that uses winston under the covers 
					(copied from: http://thottingal.in/blog/2014/04/06/winston-nodejs-logging/).
					Use standard winston syntax to create log entries (ex. logger.debug, logger.warn etc.)

