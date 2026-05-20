import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server"

export async function GET(req, {params}) {
    const {id} = await params;

    try{
        const member = await prisma.teamMember.findUnique({
            where: {memberId: Number(id)}
        })

        if (!member) {
            return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
        }

        return NextResponse.json(
            {data: member},
            {status: 200,},
            {success: true}
        );


    } catch(err){
        console.log(err)
        return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
    }
    
}


export async function DELETE(req, {params}){

    const {id} = await params

    try{
        const deleteMember = await prisma.teamMember.delete({
            where: {memberId: Number(id)}
        })

        if(!deleteMember){
            return NextResponse.json(
                {status: 404},
                {success: false},
                {message: 'Not Found'},
            )
        }

        return NextResponse.json(
            {status: 200},
            {succes: true},
            {message: 'Member Deleted'},
            {data: deleteMember}
        )
    } catch(err){
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}