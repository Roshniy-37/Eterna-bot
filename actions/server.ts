'use server'

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function getFriends(userId: string){
    const res = await prisma.chats.findMany({
        where: {
            userId
        }
    })
    return res;
}



export async function addFriend(fname: string, userId: string){
    const res = await prisma.chats.create({
        data: {
            FriendName: fname,
            userId
        }
    })

    if (res){
        return res;
    }
    return null
}

export async function verifyFID(userId: string, fid: string){
    return await prisma.chats.findFirst({
        where: {
            chatId: fid,
            userId
        }
    })
}