const neo4j = require('neo4j-driver');
const cls = require('continuation-local-storage');

exports.getSession = function () {
  const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));
  
  var session = cls.getNamespace(process.env.USER_SESSION);
  var neo4jSession = session.get('NE04J_SESSION')

  if(!neo4jSession) {
    neo4jSession = driver.session();
    session.set('NE04J_SESSION', neo4jSession)
  }
  return neo4jSession;
};

exports.dbWhere = function (name, keys) {
  if (_.isArray(name)) {
    _.map(name, (obj) => {
      return _whereTemplate(obj.name, obj.key, obj.paramKey);
    });
  } else if (keys && keys.length) {
    return 'WHERE ' + _.map(keys, (key) => {
        return _whereTemplate(name, key);
      }).join(' AND ');
  }
};

function whereTemplate(name, key, paramKey) {
  return name + '.' + key + '={' + (paramKey || key) + '}';
}
