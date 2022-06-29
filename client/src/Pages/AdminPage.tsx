import axios, { AxiosResponse } from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserInterface } from '../Interfaces/UserInterface'
import { myContext } from './Context'

export default function AdminPage() {
	const ctx = useContext(myContext)
	const [data, setData] = useState<UserInterface[]>()
	const [selectedUser, setSelectedUser] = useState<string>()
	useEffect(() => {
		axios
			.get('http://localhost:8080/getallusers', {
				withCredentials: true,
			})
			.then((res: AxiosResponse) => {
				setData(
					res.data.filter((item: UserInterface) => {
						return item.username !== ctx.username
					})
				)
				console.log(res.data)
			})
	}, [ctx])
	if (!data) return null

	const deleteuser = () => {
		let userid: string
		data.forEach((item: UserInterface) => {
			if (item.username === selectedUser) {
				userid = item.id
			}
		})
		axios.post('http://localhost:8080/deleteuser', { id: userid! }, { withCredentials: true })
	}
	return (
		<div>
			<h1>Admin page</h1>
			<select onChange={(e) => setSelectedUser(e.target.value)} name='deleteuser'>
				<option>Select A User</option>
				{data.map((item: UserInterface) => {
					return <option id={item.username}>{item.username}</option>
				})}
			</select>
			<button onClick={deleteuser}>Delete user</button>
		</div>
	)
}
