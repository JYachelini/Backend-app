const randoms = (x: any) => {
	let numbers: any = {}
	let cant = x

	if (!cant || isNaN(cant)) {
		cant = 100000000
	} else {
		cant = Number(cant)
	}

	for (let i = 0; i <= cant; i++) {
		let a = Math.floor(Math.random() * 2000 + 1)
		
		if (isNaN(numbers[a])) {
			numbers[a] = 1
		} else {
			numbers[a]++
		}
	}
	return numbers
}

process.on('message', req=>{
    process.send!(randoms(req))
    process.exit()
})

process.send!('start')
