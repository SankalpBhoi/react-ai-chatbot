import { useState, useEffect, useRef } from 'react'
import './App.css'
import { URL, API_KEY } from './constants';
import RecentSearch from './components/RecentSearch';
import QuestionAnswer from './components/QuestionAnswer';

function App() {

  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem('history')) || []
  );
  const [selectedHistory, setSelectedHistory] = useState();
  const [loader, setLoader] = useState(false);
  const [darkMode, setDarkMode] = useState('dark');

  const scrollToAnswer = useRef();

  useEffect(() => {
    if (selectedHistory) {
      askQuestion();
    }
  }, [selectedHistory]);

  useEffect(() => {
    if (darkMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const askQuestion = async () => {
    if (!question && !selectedHistory) {
      return false;
    }

    if (question) {
      // Format current question: Capitalize 1st letter and trim spaces
      const trimmedQuestion = question.trim();
      const formattedQuestion = trimmedQuestion.charAt(0).toUpperCase() + trimmedQuestion.slice(1);

      if (localStorage.getItem('history')) {
        let history = JSON.parse(localStorage.getItem('history'));

        // Keep maximum 19 existing items so with new item it stays capped at 20
        history = history.slice(0, 19);

        // Prepend new question
        history = [formattedQuestion, ...history];

        // Format all history items to have capitalized first letters and trimmed whitespace
        history = history.map((item) => item.charAt(0).toUpperCase() + item.slice(1).trim());

        // Remove duplicates using Set
        history = [...new Set(history)];

        localStorage.setItem('history', JSON.stringify(history));
        setRecentHistory(history);
      } else {
        localStorage.setItem('history', JSON.stringify([formattedQuestion]));
        setRecentHistory([formattedQuestion]);
      }
    }

    const query = question || selectedHistory;

    const payload = {
      "contents": [
        {
          "parts": [{ "text": query }]
        }
      ]
    };

    setLoader(true);

    try {
      let response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": API_KEY
        },
        body: JSON.stringify(payload)
      });

      let data = await response.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        console.error("No answer received or error:", data);
        setLoader(false);
        return;
      }

      let dataString = text.split("* ");
      dataString = dataString.map((item) => item.trim());

      setResult([
        ...result,
        { type: 'q', text: query },
        { type: 'a', text: dataString }
      ]);
      setQuestion('');

      setTimeout(() => {
        if (scrollToAnswer.current) {
          scrollToAnswer.current.scrollTop = scrollToAnswer.current.scrollHeight;
        }
      }, 500);

    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoader(false);
    }
  };

  const isEnter = (event) => {
    if (event.key === "Enter") {
      askQuestion();
    }
  };

  return (
    <div className="grid grid-cols-5 h-screen bg-amber-50 dark:bg-zinc-900 transition-colors duration-200">
      {/* Left Sidebar */}
      <RecentSearch 
        recentHistory={recentHistory} 
        setRecentHistory={setRecentHistory} 
        setSelectedHistory={setSelectedHistory} 
      />

      {/* Main Chat Area */}
      <div className="col-span-4 p-10 flex flex-col justify-between h-screen relative">
        {/* Gradient Heading */}
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700 text-center pb-4">
          Hello User, Ask me anything
        </h1>

        {/* Results / Scrollable Chat Viewport */}
        <div ref={scrollToAnswer} className="flex-1 overflow-y-auto px-4 mb-4">
          <div className="text-zinc-800 dark:text-zinc-300">
            <ul>
              {
                result.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index} />
                ))
              }
            </ul>

            {/* Spinner Loader */}
            {loader ? (
              <div className="flex justify-center p-4">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin fill-zinc-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : null}
          </div>
        </div>

        {/* Input Pill */}
        <div className="bg-red-100 border-red-200 dark:bg-zinc-800 dark:border-zinc-700 w-1/2 p-1 pr-5 text-zinc-800 dark:text-white m-auto rounded-4xl border flex h-16 items-center">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={isEnter}
            className="w-full h-full p-4 outline-none bg-transparent"
            placeholder="Ask me anything"
          />
          <button 
            onClick={askQuestion}
            className="cursor-pointer font-medium hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Ask
          </button>
        </div>

        {/* Theme Selector (Bottom Left) */}
        <select 
          value={darkMode}
          onChange={(e) => setDarkMode(e.target.value)}
          className="fixed bottom-0 left-0 m-5 p-2 bg-transparent text-zinc-800 dark:text-white outline-none cursor-pointer"
        >
          <option value="dark" className="bg-zinc-800 text-white">Dark</option>
          <option value="light" className="bg-white text-zinc-800">Light</option>
        </select>
      </div>
    </div>
  );
}

export default App;