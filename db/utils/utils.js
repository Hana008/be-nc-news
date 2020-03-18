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

    if (list.length === 0 || list === undefined) return [];
    const refObj = {};
    const arr = list.map(obj => refObj[obj.title] = obj.article_id);

    return refObj
};

exports.formatComments = (comments, articleRef, formatDates) => {

    if (comments.length === 0 || comments === undefined) return [];

    const formattedComments = comments.map(obj => {
        const objCopy = Object.assign({}, obj)
        objCopy.author = objCopy.created_by
        delete objCopy.created_by
        objCopy.article_id = articleRef[objCopy.belongs_to]
        delete objCopy.belongs_to
        return objCopy
    })

    const finalFormattedComments = formatDates(formattedComments);

    return finalFormattedComments
};



