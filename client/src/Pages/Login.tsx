import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

export default function Login() {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [systemMessage, setSystemMessage] = useState<string>('')

	const login = () => {
		axios
			.post(
				'http://localhost:8080/login',
				{
					username,
					password,
				},
				{
					withCredentials: true,
				}
			)
			.then(
				(res: AxiosResponse) => {
					if (res.data === 'success') {
						window.location.href = '/'
					}
				},
				() => {
					setSystemMessage('Username or password invalid')
				}
			)
	}

	return (
		<div className='h-[100vh] flex justify-center items-center'>
			<div className='max-w-[50%] rounded-xl border border-red-500 p-5 flex flex-col gap-5'>
				<h1 className='border border-orange-500 p-2'>Login</h1>
				<input type='text' placeholder='username' onChange={(e) => setUsername(e.target.value)}  className='border border-orange-500 p-2'/>
				<input type='text' placeholder='password' onChange={(e) => setPassword(e.target.value)}  className='border border-orange-500 p-2'/>
				<button onClick={login} className='border border-orange-500 p-2'>Login</button>
				{systemMessage ? <span>{systemMessage}</span> : null}
			</div>
		</div>
	)
}
