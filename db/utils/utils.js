exports.formatDates = list => {
    const objCopy = list.map(obj => Object.assign({}, obj));

    const formattedDate = objCopy.map(obj => {
        const time = obj.created_at
        obj.created_at = new Date(time)
        return obj
    });

    return formattedDate
};

exports.makeRefObj = list => {

    if (list.length === 0) return [];
    const refObj = {};
    const arr = list.map(obj => refObj[obj.title] = obj.article_id);

    return refObj
};

exports.formatComments = (comments, articleRef) => { };



