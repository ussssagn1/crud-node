import {getCourseViewModel} from "../routes/courses";
import {CourseType, DB} from "../DB/DB";
import {HTTP_STATUSES} from "../utils";


export const coursesRepository = {
    async findCourses(title: string | null | undefined) {
        if(title) {
            return DB.courses.filter(p => p.title.indexOf(title) > -1)
        } else {
            return DB.courses.map(getCourseViewModel)
        }
    },

    async creatCourses(title: string) {

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: title,
        };

        DB.courses.push(createdCourse)
        return createdCourse;
    },

    getCourseByID(id: number) {
        let product = DB.courses.find(c => c.id === id);
        return product;
    },

    async updateCourse(id: number, title: string) {
        const foundCourse = DB.courses.find(c => c.id === id);

        if (!foundCourse) {
            return {status: HTTP_STATUSES.NOT_FOUND_404}

        } else {
            foundCourse.title = title;
            return {status: HTTP_STATUSES.NO_CONTENT_204}
        }
    },

    deleteCourse(id: number) {
        for(let i = 0; i < DB.courses.length; ++i) {
            if(DB.courses[i].id === id) {
                DB.courses = DB.courses.filter(c => c.id !== id);
                return true;
            }
        }

        return false;
    }
}