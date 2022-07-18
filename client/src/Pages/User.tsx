import React, { useContext } from 'react'
import { myContext } from './Context'

export default function User() {

    const user = useContext(myContext)[0] /* 0 = user */


  return (
    <div className='flex flex-col gap-4 mt-10 border border-orange-500 w-96 m-auto items-center p-10'>   
        <img className='w-64 rounded-full' src={user.avatar} alt="" />
        <span>Username: {user.username}</span>
        <span>Nombre: {user.firstName} {user.lastName}</span>
        <span>Mail: {user.mail}</span>
        <span>Direccion: {user.address}</span>
    </div>
  )
}
