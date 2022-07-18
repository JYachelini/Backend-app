import axios, { AxiosResponse } from 'axios'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { myContext } from '../Pages/Context'

export default function NavBar() {
	const user = useContext(myContext)[0] /* 0 = user */
	const cart = useContext(myContext)[1] /* 1 = cart */

	const logout = () => {
		axios.get('/logout', { withCredentials: true }).then((res: AxiosResponse) => {
			if (res.data === 'success') {
				window.location.href = '/'
			}
		})
	}
	return (
		<div className='flex justify-around items-center p-8 border border-red-600'>
			<Link to='/' className='border border-rose-500'>Home</Link>
			{user ? (
				<>
					<Link to='/chat' className='border border-rose-500'>Chat</Link>
					{user.isAdmin ? <Link to='/admin' className='border border-rose-500'>Admin</Link> : null}
					<Link onClick={logout} to='/logout' className='border border-rose-500'>
						Logout
					</Link>
					<Link to='/user'><img className='rounded-full w-10' src={user.avatar} alt="" /></Link>
				</>
			) : (
				<>
					<Link to='/login' className='border border-rose-500'>Login</Link>
					<Link to='/register' className='border border-rose-500'>Register</Link>
				</>
			)}
		</div>
	)
}
