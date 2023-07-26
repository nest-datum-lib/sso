import str from './index.js';

const email = (value) => str(value)
    && (/^[\wа-яА-ЯҐЄІЇґєії](?:[\wа-яА-ЯҐЄІЇґєії.-]*[\wа-яА-ЯҐЄІЇґєії])?@[a-zA-Zа-яА-ЯҐЄІЇґєії]{2,}(?:[\wа-яА-Я.-ҐЄІЇґєії]*[\wа-яА-ЯҐЄІЇґєії])?\.[a-zA-Zа-яА-ЯҐЄІЇґєії]{2,}$/
        .test((value || '').toLowerCase()))
    && value.split("@")[0].length <= 64
    && value.length <= 254;

export default email;

