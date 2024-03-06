export type CourseViewModel =  {
    id: number,
    title: string,
    errors?: [
        {
            value: string,
            msg: string,
            param: string,
            location: string
        }
    ]
}