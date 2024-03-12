import {MongoClient} from 'mongodb'

const mongoURI = process.env.mongoURI || 'mongodb://0.0.0.0:27017';

export const client = new MongoClient(mongoURI)

export async function runDB () {
    try {
        await client.connect()

        await client.db('books').command({ping: 1})
        console.log("Connected successfully to mongo server");
    } catch {
        await client.close()
    }
}