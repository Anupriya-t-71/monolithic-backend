
import webPush from "web-push"

async function sendNotifications(payload,subscription) {

  const vapidPublicKey = process.env.WebPushpublicKey
  const vapidPrivateKey = process.env.WebPushprivateKey

  webPush.setVapidDetails(
    'mailto:project.emern@gmail.com',
    vapidPublicKey,
    vapidPrivateKey
  )
 
  try {
      const { endpoint , keys } = subscription
      const pushSubscription = {
        endpoint:endpoint,
        keys: {
          p256dh: keys.p256dh,
          auth: keys.auth
        }
      };

    await webPush.sendNotification(pushSubscription, payload);
    
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
}


export default sendNotifications