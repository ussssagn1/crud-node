export type CourseType = { // тип курса
    id: number,
    title: string,
}
export const DB: { courses: CourseType[] } = { // указываем какой тип у нашего DB.courses
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'devops'},
        {id: 4, title: 'automation qa'}
    ]
};

export type DBType = { courses: CourseType[]}