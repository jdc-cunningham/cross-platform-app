const getDateTime = () => {
    // from https://stackoverflow.com/questions/8083410/how-can-i-set-the-default-timezone-in-node-js
    process.env.TZ = "America/Chicago";
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date in YYYY-MM-DD format
    // console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

const formatTimeStr = (timeStr) => {
    if (timeStr.indexOf('T') !== -1) {
        timeStr = timeStr.split('T').join(' ').split('.000Z').join('');
    }

    return timeStr;
}

module.exports = {
    getDateTime,
    formatTimeStr
};