 let onlineuserlist=[]

export async function onlineuser(socket,userId){
  try {
    if (socket != undefined && userId != undefined) {
        onlineuserlist = onlineuserlist.filter(data=> data.userId != userId)
        onlineuserlist.push({socket,userId})
    }else if(onlineuserlist != [] && socket == undefined && userId != undefined){
         onlineuserlist.map(data=>{
            if (data.userId == userId) {
                return true
            }
         })
    }else if(onlineuserlist != [] && socket != undefined && userId == undefined){
        onlineuserlist = onlineuserlist.filter(data=> data.socket != socket)
    }else{
        return onlineuserlist
    }
  } catch (error) {
    console.log(error,"online user")
  }
}