import notfound from "../../assets/404.svg"


function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-16">
            <img alt="" src={notfound} className="lg:max-w-md"/>
            <h1
                className="mb-6 text-2xl font-bold dark:text-white md:text-5xl">Page not found</h1>
            <p className="mb-6 w-4/5 text-center text-lg text-gray-500 dark:text-gray-300">Oops! Looks like you followed a
            bad link. If you think this is a problem with us, please tell us.</p>
            <a className="text-white bg-blue-700 border border-transparent hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:hover:bg-blue-600 focus:!ring-2 p-0 font-medium rounded-lg"
            href="/">
                <span className="flex items-center rounded-md text-sm px-3 py-2">
                    <div className="mr-1 flex items-center gap-x-2">
                <svg stroke="currentColor" fill="currentColor" viewBox="0 0 20 20" className="text-xl" height="1em"
                                                            width="1em" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"></path></svg> Go back home</div></span></a>
        </div>
    );
}

export default NotFound;