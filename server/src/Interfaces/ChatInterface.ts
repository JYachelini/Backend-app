interface Author {
	// id: string
	// fristName: string
	// lastName: string
	// age: number
	alias: string
	// avatar: string
}

export interface Message {
	author: Author
	text: string
}
