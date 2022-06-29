import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

export default function Register() {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')

	const register = () => {
		axios
			.post(
				'http://localhost:8080/register',
				{
					username,
					password,
				},
				{
					withCredentials: true,
				}
			)
			.then((res : AxiosResponse) => {
				if (res.data === 'success') {
					window.location.href = '/login'
				}
			})
	}

	return (
		<div className='h-[100vh] flex justify-center items-center'>
			<div className='max-w-[50%] rounded-xl border border-red-500 p-5 flex flex-col gap-5'>
			<h1 className='border border-orange-500 p-2'>Register</h1>
			<input type='text' placeholder='username' onChange={(e) => setUsername(e.target.value)} className='border border-orange-500 p-2'/>
			<input type='text' placeholder='password' onChange={(e) => setPassword(e.target.value)} className='border border-orange-500 p-2'/>
			<button onClick={register} className='border border-orange-500 p-2'>Register</button>
			</div>
		</div>
	)
}
