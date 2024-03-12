import {MongoClient} from 'mongodb'
import {CourseType} from "../DB/DB";

const mongoURI = process.env.mongoURI || 'mongodb://0.0.0.0:27017';

export const client = new MongoClient(mongoURI)
const db = client.db('courses');
export const CourseCollection = db.collection<CourseType>('course');

export async function runDB () {
    try {
        await client.connect()

        await client.db('books').command({ping: 1})
        console.log("Connected successfully to mongo server");
    } catch {
        await client.close()
    }
}