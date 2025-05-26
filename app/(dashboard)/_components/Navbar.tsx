import React from 'react'
import NavBarRoutes from './NavBarRoutes'

const Navbar = () => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
        {/* mobile route */}
        {/* <MobileSideBar/> */}
        
        {/* sidebar route */}
        <NavBarRoutes/>
    </div>
  )
}

export default Navbar