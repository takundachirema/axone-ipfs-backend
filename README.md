# axone-ipfs-backend

## Neo4j Dev Setup
- Download the desktop version of neo4j.
- Create a new project, then a new DBMS.
- You then must start the DBMS and it will give an option to add a DB.
- To add an admin, open neo4j browser through the desktop admin.
- Then on the left-hand menu on the databases tab, change DB to 'system'
- Then run this query:
```
CALL dbms.security.createUser('axone-admin', 'password');
CALL dbms.security.addRoleToUser('admin', 'axone-admin');
```