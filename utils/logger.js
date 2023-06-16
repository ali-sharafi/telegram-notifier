const fs = require('fs');
const { getDate, getDateTime } = require('./tools');

class LoggerService {
    log(message, filename = '', showInConsole = true) {
        const logText = `${getDateTime()}     ` + message + '\r\n';
        if (showInConsole)
            console.log(logText);

        let _fileName = message.match(/(?<=\[).+?(?=\])/gm)

        if (!filename && _fileName && _fileName[0])
            filename = 'account-' + _fileName[0];

        const file = `./logs/${getDate()}${filename ? '-' + filename : ''}.log`

        fs.appendFile(file, logText, 'utf8', (error) => {
            if (error) {
                console.log(getDateTime() + ' -> ' + error);
            }
        });
    }
}
module.exports = LoggerService