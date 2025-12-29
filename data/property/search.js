import prisma from "@/lib/prisma"
export const search=async()=>{
await prisma.user.findUnique({
    where:{}
})
}