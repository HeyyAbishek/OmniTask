import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { User } from '../models/user';
import config from '../config';
import { ClientError } from '../exceptions/clientError';
import { UnauthorizedError } from '../exceptions/unauthorizedError';
import { NotFoundError } from '../exceptions/notFoundError';
import { processErrors } from '../utils/errorProcessing';
import { Error } from 'mongoose';

class AuthController {
    static register = async (req: Request, res: Response, next: NextFunction) => {
        console.log('REGISTER REQUEST BODY:', req.body);

        const { email, password } = req.body;
        let { username } = req.body;

        if (!email || !password) {
            throw new ClientError('Email and password are required');
        }

        // Auto-generate a username from email if not provided (e.g. "abishek107" from "abishek107@gmail.com")
        if (!username) {
            username = email.split('@')[0];
        }

        // Check if user already exists strictly by email or username
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        }).exec();

        if (existingUser) {
            throw new ClientError('User already exists');
        }

        try {
            const user = new User({
                username,
                email,
                password,
                role: 'USER'
            });

            await user.save();

            const token = sign({ userId: user._id.toString(), username: user.username, role: user.role }, config.jwt.secret!, {
                expiresIn: '1h',
                notBefore: '0',
                algorithm: 'HS256',
                audience: config.jwt.audience,
                issuer: config.jwt.issuer
            });

            const userData = user.toObject() as any;

            res.status(201).type('json').send({
                token,
                user: {
                    _id: user._id.toString(),
                    username: user.username,
                    email: userData.email,
                    role: userData.role || 'USER'
                }
            });
        } catch (e) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }
    };

    static login = async (req: Request, res: Response, next: NextFunction) => {
        let { username, email, password } = req.body;
        const loginIdentifier = email || username; // Prioritize email for login

        if (!(loginIdentifier && password)) {
            throw new ClientError('Email/Username and password are required');
        }

        const user = await User.findOne({ 
            $or: [{ username: loginIdentifier }, { email: loginIdentifier }] 
        }).exec();

        if (!user || !(await user.isPasswordCorrect(password))) {
            throw new UnauthorizedError("Username and password don't match");
        }

        const token = sign({ userId: user._id.toString(), username: user.username, role: user.role }, config.jwt.secret!, {
            expiresIn: '1h',
            notBefore: '0',
            algorithm: 'HS256',
            audience: config.jwt.audience,
            issuer: config.jwt.issuer
        });

        const userData = user.toObject() as any;

        res.type('json').send({
            token: token,
            user: {
                _id: user._id.toString(),
                username: user.username,
                email: userData.email || user.username,
                role: userData.role || 'USER'
            }
        });
    };

    static changePassword = async (req: Request, res: Response, next: NextFunction) => {
        const id = res.locals.jwtPayload.userId;

        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) throw new ClientError("Passwords don't match");

        const user = await User.findById(id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id} not found`);
        } else if (!(await user.isPasswordCorrect(oldPassword))) {
            throw new UnauthorizedError("Old password doesn't match");
        }

        user.password = newPassword;

        try {
            await user.save();
        } catch (e) {
            console.error(e);
            const error = e as Error.ValidationError;
            throw new ClientError(processErrors(error));
        }

        res.status(204).send();
    };
}

export default AuthController;