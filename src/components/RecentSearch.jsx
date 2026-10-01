const RecentSearch = ({ recentHistory, setRecentHistory, setSelectedHistory }) => {

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const clearSelectedHistory = (selectedItem) => {
    let history = localStorage.getItem('history');
    if (history) {
      history = JSON.parse(history);
      history = history.filter((item) => item !== selectedItem);
      setRecentHistory(history);
      localStorage.setItem('history', JSON.stringify(history));
    }
  };

  return (
    <div className="col-span-1 bg-red-100 dark:bg-zinc-800 pt-3 flex flex-col justify-between">
      <div>
        {/* Recent Search Header */}
        <h1 className="text-xl text-zinc-800 dark:text-white flex text-center justify-center items-center gap-2">
          <span>Recent Search</span>
          <button onClick={clearHistory} className="cursor-pointer">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="20px" 
              viewBox="0 -960 960 960" 
              width="20px" 
              className="fill-zinc-800 dark:fill-[#e3e3e3]"
            >
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </button>
        </h1>

        {/* History List */}
        <ul className="text-left overflow-auto text-sm mt-2">
          {
            recentHistory && recentHistory.map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between items-center pr-3 py-1 hover:bg-red-200 dark:hover:bg-zinc-700/60 rounded"
              >
                <li 
                  onClick={() => setSelectedHistory(item)}
                  className="p-1 px-5 w-full truncate text-zinc-700 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  {item}
                </li>
                <button 
                  onClick={() => clearSelectedHistory(item)}
                  className="cursor-pointer p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    height="16px" 
                    viewBox="0 -960 960 960" 
                    width="16px" 
                    className="fill-zinc-600 dark:fill-zinc-400"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                  </svg>
                </button>
              </div>
            ))
          }
        </ul>
      </div>
    </div>
  );
};

export default RecentSearch;