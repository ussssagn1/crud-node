import {CourseType} from "../DB/DB";
import {HTTP_STATUSES} from "../utils";
import {CourseCollection} from "./db";


export const coursesRepository = {
    async findCourses(title: string | null | undefined): Promise<CourseType[]> {
        const filter: any = {}
        if(title) {
            filter.title = {$regex: title}
        } 
        
        return CourseCollection.find(filter).toArray()
    },

    async creatCourses(title: string) {

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: title,
        };

        const result = await CourseCollection.insertOne(createdCourse)

        return createdCourse;
    },

    async getCourseByID(id: number) {
        let course = await CourseCollection.findOne({ id: id})
        return course;
    },

    async updateCourse(id: number, title: string) {
        const result = await CourseCollection.updateOne({id: id}, { $set: {title: title}})
        if(result.matchedCount) {
            return {status: HTTP_STATUSES.NO_CONTENT_204}
        } else {
            return {status: HTTP_STATUSES.NOT_FOUND_404}
        }
    },

    async deleteCourse(id: number): Promise<boolean> {
        const result = await CourseCollection.deleteOne({id: id})
        return result.deletedCount === 1;
    }
 }