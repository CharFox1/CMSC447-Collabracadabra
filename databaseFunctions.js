// This file has all the functions for creating and interacting with the tables in mongodb

const tables = ["Users", "Employee", "PersonInNeed", "Teams", "Events", "Missions"]

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// check if each table exists and add it if not
// don't need to do this.  Mongo automatically creates collections as needed

async function addUser(client, name, pass) {
    var collection = client.db("AFRMS").collection("Users");
    var doc = {
        name: name,
        password: pass
    }
    collection.insertOne(doc);
}

async function addEmployee(client, name, pass, availability, role) {
    
    
    const query = { "name": name, "password": pass}
    var userID = "" 
    userID = client.db("AFRMS").collection("Users").find(query)._id;
    
    if (userID = "") {
        console.log("User does not exist yet. adding it");
        addUser(client, name, pass);
        userID = client.db("AFRMS").collection("Users").find(query)._id; 
    }

    var collection = client.db("AFRMS").collection("Employee");
    var doc = {
        userID: userID,
        availability: availability,
        role: role
    };
    collection.insertOne(doc);

}

async function main() {

    // attempt to connect to the database
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://Admin:Password@cluster0.ejcge.mongodb.net/AFRMS?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true }, { useUnifiedTopology: true }, { keepAlive: 1 });

    try {
        // connect to the cluster
        await client.connect();

        // print databases in cluster
        await listDatabases(client);

    } catch (e) {
        console.error(e);
    }

    addEmployee(client, "test2", "test2", true, "Dispatch");

    addUser(client, "test", "test");

    addEmployee(client, "test1", "test1", true, "Operations Chief");

    client.close()

}

main().catch(console.error);