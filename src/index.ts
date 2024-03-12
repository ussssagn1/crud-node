import {app} from "./app";
import {getInterestingBooksRouter} from "./routes/courses"; // тип обновления курса
import {runDB} from "./repos/db";

const port = process.env.PORT || 3000

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()