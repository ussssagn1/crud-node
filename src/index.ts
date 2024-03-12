import {app} from "./app";
import {runDB} from "./repos/db";

const port = process.env.PORT || 3000

const startApp = async () => {
    await runDB();
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()