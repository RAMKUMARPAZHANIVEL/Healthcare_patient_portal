import moment from "moment";
import { v4 as uuidv4 } from 'uuid';

var fn = {};

fn.IsNull = (e) => {
    if (e === undefined || e === null) return true;
    return false;
};

fn.IsNullValue = (e) => {
    if (e === undefined || e === null || e === "") return true;
    return false;
};

fn.IsJSONEmpty = (e) => {
    if (fn.IsNull(e)) return true;
    for (var key in e) {
        if (Object.prototype.hasOwnProperty.call(e, key)) {
            return false;
        }
    }
    return true;
};

fn.IsArray = (e) => {
    if (fn.IsNull(e)) return false;
    return e.constructor === [].constructor;
};

fn.IsJSON = (e) => {
    if (fn.IsNull(e)) return false;
    return e.constructor === ({}).constructor;
};

fn.ToDate = (e, format, utc) => {
    let dt = e;
    if (fn.IsNullValue(e)) dt = new Date();
    if (fn.IsNullValue(format)) return moment(new Date(dt));
    if (utc) return moment(dt).utc().format(format);
    return moment(new Date(dt)).format(format);
};

fn.GetGUID = () => {
    return uuidv4().replace(/-/g, '');
}

fn.CloneObject = (x) => {
    return JSON.parse(JSON.stringify(x));
}

fn.RemoveDuplicatesFromArray = (input) => {
    return [...new Set(input)];
};

fn.ToBool = (e, defa) => {
    if (fn.IsNullValue(e)) return false;
    if (e === "true" || e === true) return true;
    if (e === "false" || e === false) return false;
};

fn.ToFirstCharCapital = (e) => {
    if (fn.IsNullValue(e)) return "";
    return e.charAt(0).toUpperCase() + e.slice(1);
}

fn.UpdateNumberFields = (items, numFields) => {
    for (var key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {
            let field = items[key];
            if (numFields.indexOf(field.key) > -1 && !fn.IsNullValue(field.value)) {
                let count = 0;
                count = field.validators.filter(x => ['isFloat'].indexOf(x) > -1).length;
                if (count > 0) {
                    items[key].value = parseFloat(items[key].value);
                }
                count = field.validators.filter(x => ['isNumber'].indexOf(x) > -1).length;
                if (count > 0) {
                    items[key].value = parseInt(items[key].value);
                }
            }
        }
    }
};

fn.GetAllNumberFields = (obj) => {

    let numFields = [];

    obj.forEach(e => {
        if (e.validators && e.type !== 'dropdown') {
            let count = e.validators.filter(x => ['isFloat', 'isNumber'].indexOf(x) > -1);
            if (count.length > 0) {
                numFields.push(e.key);
            }
        }
    });

    return numFields;

}

fn.sortByField = (data, field, order = "asc") => {
  if (!Array.isArray(data) || !field) return data;

  const getValue = (obj, path) => {
    return path.split(".").reduce((val, key) => (val ? val[key] : undefined), obj);
  };

  return [...data].sort((a, b) => {
    const valA = getValue(a, field);
    const valB = getValue(b, field);

    if (valA == null) return order === "asc" ? 1 : -1;
    if (valB == null) return order === "asc" ? -1 : 1;

    if (!isNaN(Date.parse(valA)) && !isNaN(Date.parse(valB))) {
      return order === "asc"
        ? new Date(valA) - new Date(valB)
        : new Date(valB) - new Date(valA);
    }

    if (!isNaN(valA) && !isNaN(valB)) {
      return order === "asc" ? valA - valB : valB - valA;
    }

    return order === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
};

fn.getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
};

fn.GroupBy = (rows, field) => {
  return rows.reduce((acc, row) => {
    const key = row[field];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(row);
    return acc;
  }, {});
};

export default fn;
