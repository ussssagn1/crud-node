import {CourseType} from "../DB/DB";

import {coursesRepository} from "../repos/coursesRepository-db";

export const coursesService = {
    async findCourses(title: string | null | undefined): Promise<CourseType[]> {
        return coursesRepository.findCourses(title)
    },

    async creatCourses(title: string) {

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: title,
        };

        const createdProduct =  await coursesRepository.creatCourses(createdCourse)
        return createdProduct
    },

    async getCourseByID(id: number) {
        return coursesRepository.getCourseByID(id)
    },

    async updateCourse(id: number, title: string) {
        return await coursesRepository.updateCourse(id, title)
    },
    async deleteCourse(id: number): Promise<boolean> {
        return coursesRepository.deleteCourse(id)
    }
}