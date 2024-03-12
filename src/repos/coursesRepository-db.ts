import {CourseType, DB} from "../DB/DB";
import {HTTP_STATUSES} from "../utils";
import {client} from "./db";


export const coursesRepository = {
    async findCourses(title: string | null | undefined): Promise<CourseType[]> {
        if(title) {
            return client.db('courses').collection<CourseType>('course').find({ title: {$regex: title}}).toArray()
        } else {
            return client.db('courses').collection<CourseType>('course').find({}).toArray()
        }
    },

    async creatCourses(title: string) {

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: title,
        };

        const result = await client.db('courses').collection<CourseType>('course').insertOne(createdCourse)

        return createdCourse;
    },

    async getCourseByID(id: number) {
        let course = await client.db('courses').collection<CourseType>('course').findOne({ id: id})
        return course;
    },

    async updateCourse(id: number, title: string) {
        const result = await client.db('courses').collection<CourseType>('course').updateOne({id: id}, { $set: {title: title}})
        if(result.matchedCount) {
            return {status: HTTP_STATUSES.NO_CONTENT_204}
        } else {
            return {status: HTTP_STATUSES.NOT_FOUND_404}
        }
    },

    async deleteCourse(id: number): Promise<boolean> {
        const result = await client.db('courses').collection<CourseType>('course').deleteOne({id: id})
        return result.deletedCount === 1;
    }
 }