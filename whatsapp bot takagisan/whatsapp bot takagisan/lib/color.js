const chalk = require('chalk')

module.exports = color = (text, color) => {
    return !color ? chalk.blue(text) : chalk.keyword(color)(text)
}
