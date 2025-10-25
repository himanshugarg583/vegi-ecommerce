import React, { useEffect, useState } from 'react'
import LayoutHeader from '../components/shopping/LayoutHeader'
import LayoutFooter from '../components/shopping/LayoutFooter'
import AuthLayout from './AuthLayout'
import Login from '../components/common/Login'
import Register from '../components/common/Register'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function PublicLayout() {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);
    const dispatch = useDispatch();

    const LoginRegisterClickHandler = (val) => {
        if(val === "login") {
            setLogin(true);
            setRegister(false);
        } else if(val === "register") {
            setRegister(true);
            setLogin(false);
        } else {
            setRegister(false);
            setLogin(false);
        }
    }

    useEffect(() => {
        if (register || login) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
    
        // Cleanup on unmount
        return () => {
          document.body.style.overflow = "";
        };
      }, [register, login]);

  return (
    <div className='w-screen'>
  {(login || register) && (
    <AuthLayout LoginRegisterClickHandler={LoginRegisterClickHandler}>
      {login ? <Login /> : <Register />}
    </AuthLayout>
  )}

  <div className='sticky top-0 z-50'>
    <LayoutHeader LoginRegisterClickHandler={LoginRegisterClickHandler} />
  </div>

  <div className="mx-auto px-5 overflow-hidden">
    <div className='min-h-screen'>
      <Outlet/>
    </div>
  </div>

  <LayoutFooter />
</div>

  )
}
 
export default PublicLayout