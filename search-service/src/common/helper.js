const isDigit = n => !Number.isNaN(Number(n));

const buildQuery = query => {
  const q = {...query};
  if ('sort_by' in q) {
    delete q.sort_by;
  }

  Object.keys(q).forEach(key => {
    if (key in q) {
      let fieldValue = {};
      const a = q[key].split(":");
      let value = "";
      let ops = "";
      if (a.length > 1) {
        [ops, value] = a
        fieldValue[`$${ops}`] = isDigit(value) ? parseInt(value, 10) : value;
      } else {
        value = isDigit(a[0]) ? parseInt(a[0], 10) : a[0];
        fieldValue = new RegExp(value, 'i');
      }
      q[key] = fieldValue;
    }
  });

  return q;
};

const buildSort = query => {
  const sortBy = query.sort_by;
  if (!sortBy) {
    return null;
  }
  
  let sortFields = [];
  sortFields = sortBy.split(/[,]/);
  sortFields = sortFields.map(field => field.trim());
  return sortFields.join(" ");
};

module.exports = {
  buildSort,
  buildQuery
};