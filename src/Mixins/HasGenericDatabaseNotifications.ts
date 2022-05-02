import { HasMany } from '@ioc:Adonis/Lucid/Orm'
import {
  HasDatabaseNotificationsMixin,
  DatabaseNotificationModel,
  HasDatabaseNotificationsModel as HasDatabaseNotificationsModelContract,
} from '@ioc:Verful/Notification'
import { DateTime } from 'luxon'
import createNotificationModel from '../Models/DatabaseNotification'

const { column, hasMany } = global[Symbol.for('ioc.use')]('Adonis/Lucid/Orm')

/**
 * This mixin is used to add the notifications relationship to the model
 */
function HasGenericDatabaseNotifications(
  notificationsTable: string
): HasDatabaseNotificationsMixin {
  const DatabaseNotification = createNotificationModel(notificationsTable)

  return (superclass) => {
    class HasGenericDatabaseNotificationsModel
      extends superclass
      implements HasDatabaseNotificationsModelContract
    {
      @column({ isPrimary: true })
      public id: any

      @hasMany(() => DatabaseNotification, {
        localKey: 'id',
        foreignKey: 'notifiableId',
      })
      public notifications: HasMany<DatabaseNotificationModel>

      public async readNotifications(this: HasGenericDatabaseNotificationsModel) {
        return this.related('notifications')
          .query()
          .whereNotNull('readAt')
          .orderBy('createdAt', 'desc')
      }

      public async unreadNotifications(this: HasGenericDatabaseNotificationsModel) {
        return this.related('notifications')
          .query()
          .whereNull('readAt')
          .orderBy('createdAt', 'desc')
      }

      public async markNotificationsAsRead(this: HasGenericDatabaseNotificationsModel) {
        await this.related('notifications').query().update({ readAt: DateTime.now().toSQL() })
      }

      public async markNotificationsAsUnread(this: HasGenericDatabaseNotificationsModel) {
        await this.related('notifications').query().update({ readAt: null })
      }
    }
    return HasGenericDatabaseNotificationsModel
  }
}

export default HasGenericDatabaseNotifications
