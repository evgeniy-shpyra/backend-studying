import express from "express"
const app = express()
const port = 3000

app.get("/", (req, res) => {
    res.send({ message: "Hello World!1111" })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
