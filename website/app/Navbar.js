export default function NavBar(){
    return(
        <div className='flex justify-between items-center fixed w-full bg-blue-100'>
            <div className='flex items-center px-5'>
                <img className='p-2 rounded-full w-24 h-24 items-center' src='logo.svg'></img>
                <h1 className='ml-5 font-bold text-2xl'>Money Moves</h1>
            </div>
            <ul className='flex justify-end pr-20 items-center h-full'>
                <li><button className='px-5 text-lg'>Home</button></li>
                <li><button className='px-5 text-lg'>About Us</button></li>
                <li><button className='px-5 text-lg'>Contact Us</button></li>
                <li><button className='px-5 text-lg'>History</button></li>
                <li><button className='px-5 text-lg'>Sign In</button></li>
                <li><button className='px-5 m-2 text-lg py-2 bg-white rounded-full'>Sign Up</button></li>
            </ul>
        </div>
    )
}