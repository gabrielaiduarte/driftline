import express from "express"
import cors from "cors"

const app = express()
const PORT = 3001

// Enable CORS for incoming requests
app.use(cors())

// Tell Express to parse JSON request bodies
app.use(express.json())

// Health check endpoint: allows the backend is runing and repsonding correctly
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        service: "driftline-server",
    })
})

app.listen(PORT, () => {
    console.log(`Driftline server running on http://localhost:${PORT}`)
})