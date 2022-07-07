interface Author {
	id: string
	username: string
	mail:string
	fristName: string
	lastName: string
	age: number
	phone: string
	avatar: string
}

export interface Message {
	author: Author
	text: string
}
