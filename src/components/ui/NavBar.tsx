import React from 'react'

const NavBar = () => {
  return (
      <nav className="block w-full  max-w-screen-lg px-4 py-2 mx-auto text-white bg-slate-900 shadow-md rounded-md lg:px-8 lg:py-3 mt-10">
  <div className="container flex flex-wrap items-center justify-between mx-auto text-gray-100">
    <a href="#"
      className="mr-4 block cursor-pointer py-1.5 text-base text-gray-200 font-semibold">
      Anonynouse Message
    </a>
    <div className="hidden lg:block">
      <ul className="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200">
          <a href="#" className="flex items-center">
            Markets
          </a>
        </li>
        <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200">
          <a href="#" className="flex items-center">
            Wallet
          </a>
        </li>
        <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200">
          <a href="#" className="flex items-center">
            Exchange
          </a>
        </li>
        <li className="flex items-center p-1 text-sm gap-x-2 text-gray-200">
          <a href="#" className="flex items-center">
            Support
          </a>
        </li>
      </ul>
    </div>
 
  </div>
</nav>
    
  )
}

export default NavBar
