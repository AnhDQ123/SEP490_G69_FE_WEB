import {GrFormNext, GrFormPrevious} from "react-icons/gr";


function Pagination({totalPage,totalElement,size,page, handleNextPage,handlePreviousPage,handleNextPrefetch, handlePreviousPrefetch}) {
    console.log("totalPage",totalPage,"totalElement",totalElement,"size",size,"page",page);
    totalPage = totalPage || 0;
    totalElement = totalElement || 0;
    size = size || 0;
    page = page || 0;
    return (
        <div
            className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
            <div className="mb-4 flex items-center sm:mb-0">
                <span onClick={handlePreviousPage}
                      onMouseEnter={handlePreviousPrefetch}
                      className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"><span
                className="sr-only">Previous page</span>
                <GrFormPrevious className="text-2xl"/>
            </span>
                <span onClick={()=>handleNextPage(totalPage)}
                      onMouseEnter={()=>handleNextPrefetch(totalPage)}
                   className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"><span
                    className="sr-only">Next page</span>
                    <GrFormNext className="text-2xl"/>
                </span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Showing&nbsp;<span
                    className="font-semibold text-gray-900 dark:text-white">{page*size +1 }-{((page+1)*size) > totalElement ? totalElement:((page+1)*size) }</span>&nbsp;of&nbsp;<span
                    className="font-semibold text-gray-900 dark:text-white">{totalElement}</span></span></div>
            <div className="flex items-center space-x-3">
                <button onClick={handlePreviousPage}
                        onMouseEnter={handlePreviousPrefetch}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-800 py-2 px-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <GrFormPrevious className="text-xl"/>
                    Previous
                </button>
                <button onClick={()=>handleNextPage(totalPage)}
                        onMouseEnter={()=>handleNextPrefetch(totalPage)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-800 py-2 px-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Next
                    <GrFormNext className="text-xl"/>
                </button>
            </div>
        </div>
    );
}

export default Pagination;