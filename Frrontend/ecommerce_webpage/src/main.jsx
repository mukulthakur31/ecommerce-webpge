import React,{useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createContext } from 'react'

export const Context = createContext({isauthenticated:false })

const AppWrapper =()=>{

  const [isauthenticated,setisauthenticated] = useState(false)
  const [loading, setloading] = useState(false)
  const [currentuser, setuser] = useState({})
  
return (
    <Context.Provider value={{
      isauthenticated,
      setisauthenticated,loading, setloading,currentuser,setuser
     }} >
     <App />
    </Context.Provider>
)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper/>
  </React.StrictMode>,
)
