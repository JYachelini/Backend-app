import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Context from './Pages/Context'



createRoot(
	document.getElementById('root')!
).render(
	// <React.StrictMode>
		<Context>
			<App />
		</Context>
	// </React.StrictMode>
)

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
// root.render(
// 	<React.StrictMode>
// 		<Context>
// 			<App />
// 		</Context>
// 	</React.StrictMode>
// )
