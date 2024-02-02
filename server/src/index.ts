require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Errors from "undici-types/errors";

const app = express();
const PORT = process.env.LOCALPORT;

app.use(cors());
app.use(bodyParser.json());

app.get(
    "/",
    (
        req: Request<
            { params: string },
            {},
            { body: string },
            { query: string }
        >,
        res: Response
    ) => {
        try {
            const name = "Aryan";
            res.status(200).json({ name });
        } catch (error: any) {
            const message = error.message;
            res.status(500).json({ message });
        }
    }
);

app.listen(PORT, () => {
    console.log("Server is Listening at port " + PORT);
});
