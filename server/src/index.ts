import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.LOCALPORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req: Request<{}, {}, { name: string }, {}>, res: Response) => {
    const { name } = req.body;
    res.status(200).json({
        name: "Aryan",
    });
});

app.listen(PORT, () => {
    console.log("Server is listening at " + PORT);
});
