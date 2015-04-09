'use strict';

function notFound(req, res) {
  res.status(404).send({
    error: 'Not found'
  });
}

module.exports = {
  notFound: notFound
};
