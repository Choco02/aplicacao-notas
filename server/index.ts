import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { createHmac } from 'crypto';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import { config } from 'dotenv';

config();

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    app.use(cors());
    next();
});

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization as string;
    if (!authorization) return res.status(401).json({ message: 'Authorization required' });

    const [, token] = authorization.split(' ');

    if (!token) res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.userId = decoded!.id;
        next();
    });
}

const createPasswordHash = (pass: string) => {
    return createHmac('sha512', process.env.PASSWORD_SALT as string)
        .update(pass)
        .digest('hex');
}


app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    if (!req.body) return res.status(400).json({ message: 'Bad request' });
    const { body: { email, password } } = req;
    const userData = await prisma.user.findUnique({ where: { email } });
    // console.log(userData);
    if (userData?.password === createPasswordHash(password)) {
        const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET as string, { expiresIn: 300 });
        res.status(200).json({ message: 'OK', token })
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/account-create',
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).not().isEmpty().trim().escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // console.log(req.body);
        const password = createPasswordHash(req.body.password);

        try {
            const user = await prisma.user.create({
                data: {
                    email: req.body.email,
                    password
                }
            });

            // console.log(user);

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: 300 });
            res.status(201).json({ message: 'OK', token });
        }
        catch (err) {
            res.status(500).json({ message: "Account create error" });
        }
    });


app.get('/posts', verifyJWT, async (req, res) => {
    const allPosts = await prisma.post.findMany({ where: { authorId: req.userId } });
    res.json(allPosts);
});

app.post('/create-post', verifyJWT, async (req, res) => {
    if (!req.body) return res.status(400).json({ message: 'Bad request' });

    const { title, text } = req.body;

    if (title && text) {
        try {
            const post = await prisma.post.create({
                data: {
                    title,
                    text,
                    authorId: req.userId
                }
            });

            // console.log(post)
            return res.status(201).json(post);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Post create error" });
        }
    }
});

app.delete('/delete-post/:id', verifyJWT, async (req, res) => {
    try {
        const deletedPost = await prisma.post.delete({ where: { id: parseInt(req.params.id) } });
        // console.log(deletedPost);
        return res.status(204).json(deletedPost);
    }
    catch (err) {
        console.log(err);
        return;
    }
});

app.listen(4000, () => {
    console.log('online');
});
