import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

export default function Register() {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [mail, setMail] = useState<string>('')
	const [firstName, setFirstName] = useState<string>('')
	const [lastName, setLastName] = useState<string>('')
	const [address, setAddress] = useState<string>('')
	const [age, setAge] = useState<string>('')
	const [phone, setPhone] = useState<string>('')
	const [avatar, setAvatar] = useState<string>('')

	const [error, setError] = useState<string>('')

	const register = () => {
		axios
			.post(
				'/register',
				{
					username,
					password,
					mail,
					firstName,
					lastName,
					address,
					age,
					phone,
					avatar,
				},
				{
					withCredentials: true,
				}
			)
			.then((res: AxiosResponse) => {
				if (res.data === 'success') {
					window.location.href = '/login'
				} else {
					setError(res.data)
				}
			})
	}

	return (
		<div className='h-[100vh] flex justify-center items-center'>
			<div className='max-w-[50%] rounded-xl border border-red-500 p-5 flex flex-col gap-5'>
				<h1 className='border border-orange-500 p-2'>Register</h1>
				<input type='text' placeholder='username' onChange={(e) => setUsername(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='password' onChange={(e) => setPassword(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='mail' onChange={(e) => setMail(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='first name' onChange={(e) => setFirstName(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='last name' onChange={(e) => setLastName(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='address' onChange={(e) => setAddress(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='age' onChange={(e) => setAge(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='phone' onChange={(e) => setPhone(e.target.value)} className='border border-orange-500 p-2' />
				<input type='text' placeholder='avatar' onChange={(e) => setAvatar(e.target.value)} className='border border-orange-500 p-2' />
				<button onClick={register} className='border border-orange-500 p-2'>
					Register
				</button>
				{error ? <span>{error}</span>:null}
			</div>
		</div>
	)
}
