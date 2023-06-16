const now = () => {
    var today = getDateObject();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var mili = today.getMilliseconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    h = checkTime(h);
    mili = checkTime(mili);

    return h + ":" + m + ":" + s + '.' + mili;
}

const subtractHour = (count = 1) => {
    var today = getDateObject();
    today.setHours(today.getHours() - count);
    return today.getHours();
}

const getSecond = () => {
    var today = getDateObject();
    return today.getSeconds();
}

const getHour = () => {
    var today = getDateObject();
    return today.getHours();
}

const getMinutes = () => {
    var today = getDateObject();
    return today.getMinutes();
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getDate = () => {
    let today = getDateObject();
    return today.toISOString().split('T')[0]
}

const getDateTime = () => {
    return getDate() + ' ' + now();
}

const round = (number, round = 2) => {
    if (!number) return 0;
    return Number(Math.round(number + "e" + round) + "e-" + round);
}

const dateDiff = (type, from, to = getDateTime()) => {
    switch (type) {
        case 'minute':
            return Math.abs(((Date.parse(from) - Date.parse(to)) / 1000) / 60);
        case 'second':
            return Math.abs(((Date.parse(from) - Date.parse(to)) / 1000));
        case 'milisecond':
            return Math.abs(((Date.parse(from) - Date.parse(to))));

        default:
            break;
    }
}

const addMinutes = (minutes, date = getDateObject()) => {
    let datetime = new Date(date.getTime() + minutes * 60000);
    return formatDateTime(datetime);
}

const sleep = async (millis) => {
    return new Promise(resolve => setTimeout(resolve, millis));
}

const getNowObject = () => {
    return getDateObject();
}

const floorToStep = (price) => {
    let stepPrice = steps.find(step => price >= step.from && price <= step.to).price

    return Math.floor(price / stepPrice) * stepPrice;
}

const findSellStartPrice = (price) => {
    let stepPrice = steps.find(step => price > step.from && price < step.to).price
    return stepPrice ? price - stepPrice : price;
}

const isInList = (list, item) => {
    return list.find(element => element.indexOf(item) != -1);
}

const ethVal = (value) => {
    return round(value * Math.pow(10, -18), 6)
}

const MVal = (value) => {
    let newMval = (value * Math.pow(10, 18)).toString();
    return newMval.substring(0, newMval.length - 1) + 0;
}

const getCardRarity = (slug) => {
    let splitted = slug.split('-');
    return splitted && splitted[splitted.length - 2] ? splitted[splitted.length - 2].replace('-', '_') : null;
}

const getTunnelProxy = async (account) => {
    let proxy = null;
    let tunnelingAgent = null;
    if (account)
        proxy = account.proxy;
    else
        proxy = await getRandomProxy()
    if (proxy) {
        tunnelingAgent = tunnel.httpsOverHttp({
            proxy: {
                host: proxy.ip,
                port: proxy.port,
                proxyAuth: `${proxy.username}:${proxy.password}`,
                headers: {
                    'User-Agent': 'Node'
                }
            }
        });
    }

    return tunnelingAgent;
}

const getRandomProxy = async () => {
    return await Proxy.findOne({
        order: sequelize.random()
    });
}

function formatDateTime(datetime) {
    let date = datetime.toISOString().split('T')[0];
    var h = datetime.getHours();
    var m = datetime.getMinutes();
    var s = datetime.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);

    let time = h + ":" + m + ":" + s;

    return date + ' ' + time;
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getDateObject() {
    return new Date();
}

const steps = [
    {
        'from': 0,
        'to': 1000,
        'price': 50
    },
    {
        'from': 1000,
        'to': 10000,
        'price': 100
    },
    {
        'from': 10000,
        'to': 50000,
        'price': 250
    },
    {
        'from': 50000,
        'to': 100000,
        'price': 500
    },
    {
        'from': 100000,
        'to': 10000000000000000000000000000000000,
        'price': 1000
    }
]

module.exports = {
    now,
    getRandomInt,
    getDate,
    getDateTime,
    dateDiff,
    addMinutes,
    getHour,
    getSecond,
    subtractHour,
    sleep,
    getNowObject,
    floorToStep,
    findSellStartPrice,
    isInList,
    getMinutes,
    steps,
    round,
    ethVal,
    getCardRarity,
    MVal,
    getRandomProxy,
    getTunnelProxy
}