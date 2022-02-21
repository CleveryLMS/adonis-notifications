import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class NotificationProvider {
  constructor(protected app: ApplicationContract) {}
  public static needsApplication = true

  public register() {
    this.app.container.singleton('Verful/Notification', () => {
      const config = this.app.container.resolveBinding('Adonis/Core/Config').get('notification', {})
      const Notification = require('../src/Notification').default
      return new Notification(this.app, config)
    })
    this.app.container.singleton('Verful/Notification/Mixin', () => {
      return require('../src/Traits/Notifiable').default
    })
  }
}
