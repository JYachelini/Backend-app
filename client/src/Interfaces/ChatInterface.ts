interface Author {
	// id: string
	username: string
	avatar: string
}

export interface Message {
	author: Author
	text: string
}
