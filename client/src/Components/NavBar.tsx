import axios, { AxiosResponse } from 'axios'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { myContext } from '../Pages/Context'

export default function NavBar() {
	const ctx = useContext(myContext)
	const logout = () => {
		axios.get('http://localhost:8080/logout', { withCredentials: true }).then((res: AxiosResponse) => {
			if (res.data === 'success') {
				window.location.href = '/'
			}
		})
	}
	return (
		<div className='flex justify-around items-center p-8 border border-red-600'>
			<Link to='/' className='border border-rose-500'>Home</Link>
			{ctx ? (
				<>
					<Link to='/chat' className='border border-rose-500'>Chat</Link>
					{ctx.isAdmin ? <Link to='/admin' className='border border-rose-500'>Admin</Link> : null}
					<Link onClick={logout} to='/logout' className='border border-rose-500'>
						Logout
					</Link>
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
