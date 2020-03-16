exports.formatDates = list => {
    return []
};

exports.makeRefObj = list => {

    if (list.length === 0) return [];
    const refObj = {};
    const arr = list.map(obj => refObj[obj.title] = obj.article_id);

    return refObj
};

exports.formatComments = (comments, articleRef) => { };





