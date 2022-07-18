import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import { storage } from '../firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 } from 'uuid'

export default function Register() {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [mail, setMail] = useState<string>('')
	const [firstName, setFirstName] = useState<string>('')
	const [lastName, setLastName] = useState<string>('')
	const [address, setAddress] = useState<string>('')
	const [age, setAge] = useState<string>('')
	const [phone, setPhone] = useState<string>('')

	const [avatar, setAvatar] = useState<any>(null)

	const [error, setError] = useState<string>('')

	const register = async () => {
		if (avatar == null) return

		const pathToSaveImages = 'images/'
		const nameAvatar = `${avatar.name + v4()}`
		const avatarRef = ref(storage, `${pathToSaveImages}${nameAvatar}`)

		axios
			.post(
				'/register',
				{ username, password, mail, firstName, lastName, address, phone, age, avatar: pathToSaveImages + nameAvatar },
				{
					withCredentials: true,
				}
			)
			.then(async (res: AxiosResponse) => {
				if (res.data === 'success') {
					if (avatar.type !== ('image/jpg' || 'image/png')) {
						await uploadBytes(avatarRef, avatar).then(async () => {
							const urlAvatar = await getDownloadURL(avatarRef)
							await axios.post('/user/avatar', { username, urlAvatar }, { withCredentials: true }).then((res)=>console.log(res.data))
						})
						window.location.href = '/login'
					}
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
				<input type='file' placeholder='avatar' onChange={(e) => setAvatar(e.target.files![0])} className='border border-orange-500 p-2' />
				<button onClick={register} className='border border-orange-500 p-2'>
					Register
				</button>
				{error ? <span>{error}</span> : null}
			</div>
		</div>
	)
}
