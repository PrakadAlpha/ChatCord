const moment = require('moment')

exports.formatMessages = (username, txtMsg) => {

return{
  username,
  txtMsg,
  time: moment().format('h:mm a')
}

}