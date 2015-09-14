<a name="module_alfilesystemwatcher"></a>
## alfilesystemwatcher
Supports a method to watch a particular directory for files with a particular extension.                 Any files that are added will be automatically read and uploaded to AwardLetter files API.By default, activity is logged to a file within ./logs/alfilesystemwatcher.log usingnodejs winston module. This can be modified to log to numerous sources including adatabase or a SaaS logging product.  Note that this script expects any added files to be available in whole. When copying large filesinto the source directory, it is best to save it with an extension that is different from thewatched extension. Once the file has been copied in full, rename the extension to the watchedextension.***### Environment Requirements:* SSL access to the public internet over port 5443.* Node.js installed.### Installing directly from github:Clone or download as zip to local machine. For the later, unzip to desired location.Install the following dependencies via npm (npm install [module-name]):* chokidar* winston* oath-wrap* al-files-service* promise### Configuration:All configuration is contained within the config.json file.**Logging:** The module is configured to log to a _logs_ folder within the root directory of the application.Standard log entries will be written to a file named alfilesystemwatcher.log while unhandled exceptions willbe logged to a file named alfilesystemwatchererrors.log.'  "logging" : { "directory" : "./logs" }**Authorization:** The upload process requires an authorization token from a secure token service(STS).'  "oauthWrapRequest" : { "url":"sts_url", "creds":{"uid":"userid", "pwd":"password"}, "wrapScope":"scope" }The following values must be provided in order to invoke the STS and acquire an authorization token:JSON Element | Description-------------|--------------------------------------------------------------------------url | The STS urlcreds.userid | User Idcreds.pwd | User passwordwrapScope | The resource that will be accessed using the authorization token.###Running alfilesystemwatcher:From the alfilesystemwatcher root directory, execute the following in a command prompt:  node alfilesystemwatcher.js***

<a name="module_alfilesystemwatcher..watch"></a>
### alfilesystemwatcher~watch(config)
Automatically upload files that are created within a designated source directory.

**Kind**: inner method of <code>[alfilesystemwatcher](#module_alfilesystemwatcher)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | Contains values for 1) directory to watch and 2) file extension to watch. |

