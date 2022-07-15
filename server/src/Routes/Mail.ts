import { Router } from 'express'
import Mailer from '../Controllers/mail.controller'

const mail = new Mailer()

export const routerMail = Router()

routerMail.route('/sendMail').post(mail.newRegisterMail)