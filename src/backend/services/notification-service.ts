import { Expo } from 'expo-server-sdk';
import nodemailer from 'nodemailer';
import { Server } from 'socket.io';
import { NotificationModel } from '../models/notification';

export class NotificationService {
  private expo: Expo;
  private mailer: nodemailer.Transporter;
  private io: Server;
  private templates: Map<string, string>;

  constructor(io: Server) {
    this.expo = new Expo();
    this.mailer = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    this.io = io;
    this.templates = this.initializeTemplates();
  }

  private initializeTemplates(): Map<string, string> {
    return new Map([
      ['appointment_confirmation', 'Your appointment has been confirmed for {{date}} with Dr. {{doctor}}'],
      ['appointment_reminder', 'Reminder: You have an appointment tomorrow at {{time}}'],
      ['chat_message', 'New message from {{sender}}: {{message}}']
    ]);
  }

  async sendPushNotification(tokens: string[], title: string, body: string, data?: object) {
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Push notification error:', error);
      }
    }
  }

  async sendEmail(to: string, subject: string, template: string, variables: object) {
    const content = this.compileTemplate(template, variables);
    
    try {
      await this.mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: content
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }

  sendRealtimeNotification(userId: string, event: string, data: object) {
    this.io.to(userId).emit(event, data);
  }

  private compileTemplate(templateName: string, variables: object): string {
    let template = this.templates.get(templateName) || '';
    
    Object.entries(variables).forEach(([key, value]) => {
      template = template.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    
    return template;
  }

  async createNotification(notification: NotificationModel) {
    try {
      const { userId, type, content, metadata } = notification;
      
      switch (type) {
        case 'push':
          const tokens = await this.getUserPushTokens(userId);
          await this.sendPushNotification(tokens, content.title, content.body, metadata);
          break;
          
        case 'email':
          const userEmail = await this.getUserEmail(userId);
          await this.sendEmail(userEmail, content.subject, content.template, metadata);
          break;
          
        case 'realtime':
          this.sendRealtimeNotification(userId, content.event, metadata);
          break;
      }
      
      await NotificationModel.create(notification);
    } catch (error) {
      console.error('Notification creation error:', error);
      throw error;
    }
  }

  private async getUserPushTokens(userId: string): Promise<string[]> {
    // Implementation to fetch user's push notification tokens
    return [];
  }

  private async getUserEmail(userId: string): Promise<string> {
    // Implementation to fetch user's email
    return '';
  }
}