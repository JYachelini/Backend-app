export interface UserInterface {
	username: string
	mail: string
	isAdmin: boolean
	id: string
	firstName: string
	lastName: string
	address: string
	age: string
	phone: string
	avatar: string
}

export interface DatabaseUserInterface {
	username: string
	mail: string
	password: string
	isAdmin: boolean
	_id: string
	firstName: string
	lastName: string
	address: string
	age: string
	phone: string
	avatar: string
}
