import { Router } from 'express';
import auth from './auth';
import user from './user';
import task from './task'; 

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/tasks', task); 

export default routes;