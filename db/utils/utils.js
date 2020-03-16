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


// iterate through the array and changed created_at key to be a human readable timestamp

//change the value of created at to human readable by passing it through a date function


