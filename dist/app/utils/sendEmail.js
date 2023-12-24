"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendMail = (to, html) => __awaiter(void 0, void 0, void 0, function* () {
    //
    // SMTP -> Send mail transfer protocol
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: config_1.default.NODE_ENV === 'production',
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: 'asifalazadami2016@gmail.com',
            pass: 'gxnw tmlg decd jckf',
        },
    });
    //
    yield transporter.sendMail({
        from: 'asifalazadami2016@gmail.com',
        to,
        subject: 'Reset your password within 10min',
        text: 'You could change your password through the link',
        html, // html body
    });
    // console.log('Message sent: %s', info.messageId);
});
exports.sendMail = sendMail;
