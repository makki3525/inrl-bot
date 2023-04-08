// created by @inrl
const { inrl,
errorMessage,
getString,
quoted,
infoMessage,
isAdmin,
isBotAdmin } = require('../lib/');
const axios = require("axios");
const fs = require('fs');


 inrl(
	   {
	pattern: ['tag'],
	desc: 'no desc',
        sucReact: "💯",
        category: ["system","all"],
        type :"whatsapp",
        onlyGroup : true
	   },
	async (m,conn,match ) => {
	        let admin = await isAdmin(m, conn);
	        let BotAdmin = await isBotAdmin(m, conn);
	        if(!admin && !m.client.isCreator) return await m.reply('Action only For admin or Owner');
            const groupMetadata = await conn.groupMetadata(m.key.remoteJid).catch((e) => {});
            const participants = await groupMetadata.participants;
            if(m.quoted){
            match = match || m.quoted.text;
            }
            if(!match) return await m.reply('need text');
            conn.sendMessage(m.key.remoteJid,
{
                text: match,
                mentions: participants.map((a) => a.id),
            },
{
                quoted: m,
            });
 });
inrl({ pattern: ["promote"],
usage: '<mentions|reply>',
sucReact: "😎",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
          let admin = await isAdmin(message, client);
	      let BotAdmin = await isBotAdmin(message, client);
        if(!BotAdmin) return await message.reply('Bot must Be Admin');
        if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
        if(!message.quoted) return mesage.reply('reply to a user');
        await client.groupParticipantsUpdate( message.from,
[message.quoted.sender],
"promote" );
        client.sendMessage(message.from,
{
                text: `@${message.quoted.sender.split('@')[0]} Promoted As admin.`,
                mentions: [message.quoted.sender]
            },
{
                quoted: message,
            });
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["demote"],
usage: '<mentions|reply>',
sucReact: "🤐",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
          let admin = await isAdmin(message, client);
	      let BotAdmin = await isBotAdmin(message, client);

        if(!BotAdmin) return await message.reply('Bot must Be Admin');
        if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
        if(!message.quoted) return mesage.reply('reply to a user');
        await client.groupParticipantsUpdate( message.from,
[message.quoted.sender],
"demote" );
   return await client.sendMessage(message.from,
{
                text: `@${message.quoted.sender.split('@')[0]} Demoted From admin.`,
                mentions: [message.quoted.sender]
            },
{
                quoted: message,
            });
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["kick"],
usage: '<mentions|reply>',
sucReact: "😤",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
if(!match){
          let admin = await isAdmin(message, client);
	      let BotAdmin = await isBotAdmin(message, client);

        if(!BotAdmin) return await message.reply('Bot must Be Admin');
        if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
        if(!message.quoted) return mesage.reply('reply to a user');
            await client.groupParticipantsUpdate( message.from,
[message.quoted.sender],
"remove" );
            return await client.sendMessage(message.from,
{
                text: `@${message.quoted.sender.split('@')[0]} kicked From The Group.`,
                mentions: [message.quoted.sender]
            },
{
                quoted: message,
            });
            } else if(match.toLowerCase() == 'all'){
        if(!BotAdmin) return await message.reply('Bot must Be Admin');
        if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
        const groupMetadata = await client.groupMetadata(message.from).catch(e => {})
	       const participants = await groupMetadata.participants;
           let admins = await participants.filter(v => v.admin !== null).map(v => v.id);
participants
				.filter((U) => !U.admin == true)
				.map(({ id }) => id)
                .forEach(async(k)=>{
                await client.groupParticipantsUpdate( message.from,
[k],
"remove" );
        });
       return message.reply('all group Participants will been kicked!')
           }
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["add"],
usage: '<num1/numb2&etc>',
sucReact: "😋",
category: ["group","all"],
type :'group',
onlyGroup : true
},
async (message,client,match) => {
  const BotAdmin = await isBotAdmin(message,client);
  const admin = await isAdmin(message,client);

  match = match.replaceAll(' ','');
        if(!BotAdmin) return await message.reply('Bot must Be Admin');
        if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
        if(match){
        let users = match.replace(/[^0-9]/g,
'')+'@s.whatsapp.net';
    let info = await client.onWhatsApp(users);
	ex = info.map((jid) => jid.jid);
	if (!ex.includes(users)) return await message.reply("This number doesn't exists on whatsapp");
        const su = await client.groupParticipantsUpdate(message.from,
[users],
"add" );
        if(su[0].message == 403) {
		message.reply(`Couldn't Add Invite Send`);
		return await message.sendGroupInviteMessageRequst(users.replace('@s.whatsapp.net',''));
	    } else if (su[0].message == 408) {
	            await client.sendMessage(message.from,
{
                text: `Couldn't add @${users.split('@')[0]} because they left the group recently. Try again later.`,
                mentions: [users]
            },
{
                quoted: message,
            });
		const code = await client.groupInviteCode(message.from);
		return await client.sendMessage(users,
{ text : `https://chat.whatsapp.com/${code}`},
{ quoted : message })
	    } else if (su[0].message == 401) {
	            await client.sendMessage(message.from,
{
                text: `Couldn't add @${users.split('@')[0]} because they blocked the bot number.`,
                mentions: [users]
            },
{
                quoted: message,
            });
	    } else if (su[0].message == 200) {
		        return await client.sendMessage(message.from,
{
                text: `@${users.split('@')[0]} Added To the group.`,
                mentions: [users]
            },
{
                quoted: message,
            });
	    } else if (su[0].message == 409) {
	           return await client.sendMessage(message.from,
{
                text: `@${users.split('@')[0]} Already in Group.`,
                mentions: [users]
            },
{
                quoted: message,
            });
	    } else {
		return await message.reply(JSON.stringify(su));
	       }
        }else if(message.quoted){
        let users = message.quoted.sender;
        const su = await client.groupParticipantsUpdate( message.from,
[users],
"add" );
        if(su[0].message == 403) {
		message.reply(`Couldn't Add Invite Send`);
		return await message.sendGroupInviteMessageRequst(users.replace('@s.whatsapp.net',''));
	    } else if (su[0].message == 408) {
	            await client.sendMessage(message.from,
{
                text: `Couldn't add @${users.split('@')[0]} because they left the group recently. Try again later.`,
                mentions: [users]
            },
{
                quoted: message,
            });
		const code = await client.groupInviteCode(message.from);
		return await client.sendMessage(users,
{ text : `https://chat.whatsapp.com/${code}`},
{ quoted : message })
	    } else if (su[0].message == 401) {
	            await client.sendMessage(message.from,
{
                text: `Couldn't add @${users.split('@')[0]} because they blocked the bot number.`,
                mentions: [users]
            },
{
                quoted: message,
            });
	    } else if (su[0].message == 200) {
		        return await client.sendMessage(message.from,
{
                text: `@${users.split('@')[0]} Added To the group.`,
                mentions: [users]
            },
{
                quoted: message,
            });
	    } else if (su[0].message == 409) {
	           return await client.sendMessage(message.from,
{
                text: `@${users.split('@')[0]} Already in Group.`,
                mentions: [users]
            },
{
                quoted: message,
            });
	    } else {
		return await message.reply(JSON.stringify(su));
	       }
       }
});
inrl({ pattern: ["gpp"],
desc: 'set full size profile picture',
sucReact: "😁",
category: ["all","create"],type : 'group',
onlyGroup : true
},
	async (message,client,match) => {
try {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
    if(!message.quoted) return await message.reply('reply to an image!');
    if(!message.quoted.imageMessage) return await message.reply('reply to an image!');
    let _message = message.quoted.imageMessage;
	let download = await client.downloadMediaMessage(_message);
    await client.updateProfilePicture(message.from,
    download );
	return message.reply ('group icon updated!');
  } catch (e){
message.reply(e)
}
})
inrl({ pattern: ["fullgpp"],
desc: 'set  profile picture of group with any resolution',
sucReact: "🔥",
category: ["all","create"],type : 'group',
onlyGroup : true
},
	async (message,client,match) => {
try {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
    if(!message.quoted) return await message.reply('reply to an image!');
    if(!message.quoted.imageMessage) return await message.reply('reply to an image!');
		let download = await message.quoted.download();
		await message.updateProfilePicture(message.from,download );
		return message.reply ('group icon updated!');
} catch (e){
message.reply(e)
     }
});inrl({ pattern: ["gname"],
usage: '<name>',
sucReact: "🙃",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');

if (message.client.text > 75)  return await client.sendMessage( message.from,
{ text: errorMessage('Text is too long') },
{ quoted: message })
        let txt = message.client.text || " ";
        await client.groupUpdateSubject(message.from,
txt);
        return await client.sendMessage(message.from,
{ text : '_group name changed successfully!_'},
{ quoted : message })
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["gdesc"],
usage: '<desc>',
sucReact: "🙂",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');

if(message.client.text > 400)  return await client.sendMessage( message.from,
{ text: 'Text is too long' },
{ quoted: message })
        let txt = match || " ";
        await client.groupUpdateDescription(message.from,
txt);
        return await client.sendMessage(message.from,
{ text : '_group name changed successfully!_'},
{ quoted : message })
} catch (e){
message.reply(e)
     }
});
inrl({pattern: ["mute"],
sucReact: "🤙",
category: ["group","all"],
type :'group',
onlyGroup : true
},
async (message,client,match) => {

    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
try {
            await client.groupSettingUpdate(message.from,
"announcement");
            return await client.sendMessage( message.from,
{ text: '_Group Closed_' },
{ quoted: message } );
} catch(e){
return message.reply(e);
     }
});
inrl({pattern: ["unmute"],
sucReact: "🤙",
category: ["group","all"],
type :'group',
onlyGroup : true
},
async (message,client,match) => {

    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
try {
            await client.groupSettingUpdate(message.from,
"not_announcement");
            return await client.sendMessage( message.from,
{ text: '_Group Opened!_' },
{ quoted: message } );
} catch(e){
return message.reply(e);
     }
});
inrl({pattern: ["lock"],
sucReact: "🤙",
category: ["group","all"],
type :'group',
onlyGroup : true
},
async (message,client,match) => {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');

try {
            await client.groupSettingUpdate(message.from,
"locked");
            return await client.sendMessage( message.from,
{ text: '_Group Locked!_' },
{ quoted: message } );
} catch(e){
return message.reply(e);
     }
});
inrl({pattern: ["unlock"],
sucReact: "🤙",
category: ["group","all"],
type :'group',
onlyGroup : true
},
async (message,client,match) => {

    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');
try {
            await client.groupSettingUpdate(message.from,
"unlocked");
            return await client.sendMessage( message.from,
{ text: '_Group Unlocked!_' },
{ quoted: message } );
} catch(e){
return message.reply(e);
     }
});
inrl({ pattern: ["left"],
sucReact: "👋",
category: ["group","all"],
type :'group',
onlyGroup : true,
fromMe :true
},
  async (message,client,match) => {
try {

        await client.groupLeave(message.from)
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["invite"],
sucReact: "💖",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');

        const code = await client.groupInviteCode(message.from);
        return await client.sendMessage( message.from,
{ text: `🔗 Group Link: https://chat.whatsapp.com/${code}` },
{ quoted: message } );
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["revoke"],
sucReact: "👌",
category: ["group","all"],
type :'group',
onlyGroup : true
},
  async (message,client,match) => {
try {
    const BotAdmin = await isBotAdmin(message,client);
    const admin = await isAdmin(message,client);
    if(!BotAdmin) return await message.reply('Bot must Be Admin');
    if(!admin && !message.client.isCreator) return await message.reply('Action only For admin or Owner');

        await client.groupRevokeInvite(message.from);
        return await client.sendMessage( message.from,
{ text: `Group link revoked.` },
{ quoted: message } );
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["acpt"],
sucReact: "🆗",
category: ["group","all"],
type :'owner',
fromMe :true
},
  async (message,client,match) => {
try {
  if(!match||!match.match(/^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]/)) return await message.reply('need Url Of Group.');

        let urlArray = (match).trim().split("/");
        if (!urlArray[2] == 'chat.whatsapp.com')return await client.sendMessage( message.from,
{ text: 'Enter valid link'},
{ quoted: message } );
        const response = await client.groupAcceptInvite(urlArray[3]);
        return await client.sendMessage( message.from,
{ text: `Joined: ${response}` },
{ quoted: message } );
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["getinfo"],
sucReact: "🆗",
category: ["group","all"],
type :'group'
},
  async (message,client,match) => {
try {
  if(!match||!match.match(/^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]/)) return await message.reply('need Url Of Group.');

        let urlArray = (match).trim().split("/")[3]; 
    	const response = await client.groupGetInviteInfo(urlArray)
		return await client.sendMessage( message.from,
{ text: "id: " + response.id + "\nsubject: " + response.subject + "\nowner: " + `${response.owner ? response.owner.split('@')[0] : 'unknown'}` + "\nsize: " + response.size + "\nrestrict: " + response.restrict + "\nannounce: " + response.announce + "\ncreation: " + require('moment-timezone')(response.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') + "\ndesc" + response.desc},
{ quoted: message } );
} catch (e){
message.reply(e)
     }
});// this actul not a grp function but me😹

inrl({ pattern: ["pp"],
desc: 'set  profile picture of bot',
sucReact: "😁",
category: ["all","create"] ,
type :'owner',
fromMe :true},
	async (message,client,match) => {
try {
    if(!message.quoted) return await message.reply('reply to an image!');
    if(!message.quoted.imageMessage) return await message.reply('reply to an image!');
	let _message = message.quoted.imageMessage;
	let download = await client.downloadMediaMessage(_message);
    await client.updateProfilePicture(message.client.botNumber,download ).catch((err) => fs.unlinkSync(download))
    return message.reply ('profile picture updated!');
} catch (e){
message.reply(e)
     }
});
inrl({ pattern: ["fullpp"],
desc: 'set  profile picture of bot with any resolution',
sucReact: "🔥",
category: ["all","create"] ,
type :'owner',
fromMe:true
},
	    async (message,client,match) => {
try {
        if (!message.quoted) return await message.reply('reply to an image!');
        if(!message.quoted.imageMessage) return await message.reply('reply to an image!');
		let download = await message.quoted.download();
		await message.updateProfilePicture(message.client.botNumber,download );
		return message.reply ('profile picture updated!');
} catch (e){
message.reply(e)
     }
});
inrl({
pattern: ["bug"],
desc: 'it send an bug msg',
sucReact: "🔥",
category: ["all","create"] ,
type :'owner',
fromMe:true
},
	    async (message,client,match) => {
	let To =  message.from;
	if(match && (match.endsWith('net') || match.endsWith('us'))) To = match;
	await client.sendMessage(client.user.id, {text:"_can't use this cmd '(bug)' repeatedly!may your number Ban due to Spam_"});
	return await message.sendBugRequst(To);
        //message.sendBugReqV2(m.from).MOD
});
