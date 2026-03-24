'use client'

import ChildLayout from "@/components/layout/ChildLayout/ChildLayout"
import Container from "@/components/layout/Container/Container"
import TableList from "@/components/ui/TableList/TableList.js"
import ClientSearch from "./components/ClientSearch"
import {useEffect, useState} from 'react'

export default function Clients({children}){

    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch("/api/users")
        .then(res => res.json())
        .then(data => {
            const formattedUsers = data.map(user => ({
                userId: user.userId,
                username: user.username,
                name: user.firstName + ' ' + user.lastName,
                userEmail: user.userEmail,
                accountRole: user.role.role,
                accountStatus: user.userStatus.status,
                dateCreated: new Date(user.dateCreated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
            }))
            setUsers(formattedUsers)
            console.log(formattedUsers)
        })

        console.log(users)
    }, [])

    return(
        <ChildLayout>
            <ClientSearch/>
            <Container>
                <TableList 
                fields={
                    [
                        {fieldName: 'ID', key: 'userId', span: 'fit-content'},
                        {fieldName: 'Username', key: 'username', span: '20%'},
                        {fieldName: 'Name', key: 'name', span: '15%'},
                        {fieldName: 'Email', key: 'userEmail', span: '20%'},
                        {fieldName: 'Role', key: 'accountRole', span: '10%'},
                        {fieldName: 'Status', key: 'accountStatus', span: '10%'},
                        {fieldName: 'Date Created', key: 'dateCreated', span: '15%'},

                    ]}
                data={users}
                />
            </Container>
        </ChildLayout>
    )
}