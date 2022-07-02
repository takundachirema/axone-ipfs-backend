import * as neo4j from 'neo4j-driver';
import * as cls from 'continuation-local-storage';

export function getNeo4jSession() {
  console.log("get neo4j driver...\n")
  const driver = neo4j.driver(process.env.NEO4J_URL, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));
  
  var session = cls.getNamespace(process.env.USER_SESSION);
  var neo4jSession = session.get('NE04J_SESSION')

  if(!neo4jSession) {
    neo4jSession = driver.session();
    try{
      session.set('NE04J_SESSION', neo4jSession)
    }catch(err){
      console.log('error set session: ',err.message)
    }
  }
  
  console.log("got neo4j session\n")
  return neo4jSession;
};

export function dbWhere(name, keys) {
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
