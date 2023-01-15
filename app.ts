import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express, { request } from 'express';
import AdminSequelize from '@adminjs/sequelize';
import AdminMongoose, { Database } from "@adminjs/mongoose";

// Models

import {Role} from './models/role.entity';
import {User} from './models/user.entity';
import { Document } from './models/document.entity';

//Controllers
import UserController from './controllers/UserController';

import session from 'express-session';
import cors from 'cors';

// Routes
import auth from './routes/auth';
import document from './routes/document';

import hbs from 'hbs';
const path = require('node:path');

// Dotenv
require('dotenv').config()

const bcrypt = require('bcryptjs');
const mysqlStore = require('express-mysql-session')(session);


const sessionStore = new mysqlStore({
  connectionLimit:10,
  password: process.env.SQL_DB_PASS,
  user: process.env.SQL_DB_USER,
  database: process.env.SQL_DB_NAME,
  host: process.env.SQL_DB_HOST,
  port: process.env.SQL_DB_PORT,
  createDatabaseTable: true
})

const PORT = 3001

// const {PORT} = process.env;

const ROOT_DIR = __dirname

AdminJS.registerAdapter({
  Resource: AdminSequelize.Resource,
  Database: AdminSequelize.Database
});

AdminJS.registerAdapter({
  Resource: AdminMongoose.Resource,
  Database: AdminMongoose.Database
});

const generatedResourse = (Model: object, properties: any = {}, actions: any = {}) => {
  return {
  resource: Model,
  options: {
    properties: {
      ...properties,
      createdAt: {
        isVisible: {
          list: true, edit: false, create: false, show: true
        }
      },
      updatedAt: {
        isVisible: {
          list: true, edit: false, create: false, show: true
        }
      }
    },
    actions:{
        ... actions
    }
  }
}};

const start = async () => {
  const app = express()

  const adminOptions = {
    resources:[
      generatedResourse(Document),
      generatedResourse(
        User,
        {
        password: {
          type: 'password'
          }
        },
        {
        new: {
          before: async(request: any, context: any) => {
            if (request.payload.password) {
                request.payload.password = await bcrypt.hashSync(request.payload.password, 10);
            }
            return request;
           }, 
          after: async(originalResponse: any, request:any, context: any) => {
           //TODO:enviar email com acessos
            return originalResponse;
           }
        }
        }

      ),
      generatedResourse(Document)
      
      
    ],

    dashboard:{
      component: AdminJS.bundle('./components/DashboardComponent')
    },
   // rootPath: '/internal/admin',
    branding: {
      companyName:'Documentos Online do Benna',
      logo: 'https://netclimberwebdesign.com/wp-content/uploads/2017/05/Google-Docs-Logo-1-e1495818992208.png',
      favicon: 'https://webstockreview.net/images/google-docs-icon-png-4.png'
        }

  }
 
  const admin = new AdminJS(adminOptions)

// const adminRouter = AdminJSExpress.buildRouter(admin)
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, 
    {
      authenticate:async (email, password) => {      
        const userCtrl = new UserController()
        return await userCtrl.login(email, password);
      },
      cookieName: 'adminjs-internal-admin',
      cookiePassword: 'scq3gl6wWGG05qhm0o07@%e$V6jo0Tt*'

  },
  null,
  // {
  //   store: sessionStore,
  //   resave: true,
  //   saveUninitialized: true,
  //   secret: '%}f%0.]k(-ypL{c{M,+cwIi/K,d8sEZYApYCj#wEnjy025()zWE&aLzBinw[]0E',
  //   cookie:{
  //     httpOnly: process.env.NODE_ENV !== 'production',
  //     secure: process.env.NODE_ENV === 'production'
  //   },
  //   name: 'adminjs-internal-admin',
  // }
  
  )

  app.use(cors());
  app.use(express.json());
  hbs.registerPartials(path.join(ROOT_DIR, 'views'))
  app.set('view engine', '.hbs')

  app.use(admin.options.rootPath, adminRouter)
  app.use('/document', document)
  app.use('/auth', auth)

  app.get('/', (req, res) => {
    res.send('Api is running')
  })

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()