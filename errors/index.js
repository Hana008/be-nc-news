exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: 'method not allowed' });
};

exports.errorHandler = (err, req, res, next) => {
  const errCodes = {
    '23502': { status: 404, msg: { msg: 'missing information!' } },
    '22P02': { status: 400, msg: { msg: 'invalid data type!' } },
    '42703': { status: 400, msg: { msg: 'column does not exist!' } }
  }
  if (Object.keys(errCodes).includes(err.code)) {
    res.status(errCodes[err.code].status).send(errCodes[err.code].msg)
  }
  else { res.status(err.status).send(err.msg) }

}
