
import { io, onlineuser } from "../../config/socketConfig.js";

export function sendNotification(groupId, notification) {
    io.to(groupId).emit('receiveNotification', notification);
}