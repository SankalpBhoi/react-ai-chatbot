import Answer from './Answers';

const QuestionAnswer = ({ item, index }) => {
  return (
    <div 
      className={item.type === 'q' ? 'flex justify-end' : ''}
    >
      {
        item.type === 'q' ? (
          <li className="text-right p-1 border-8 bg-red-100 border-red-100 dark:bg-zinc-700 dark:border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl w-fit">
            <Answer ans={item.text} totalResult={1} index={index} type={item.type} />
          </li>
        ) : (
          item.text.map((ansItem, ansIndex) => (
            <li key={ansIndex * Math.random()} className="text-left p-1">
              <Answer ans={ansItem} totalResult={item.text.length} index={ansIndex} type={item.type} />
            </li>
          ))
        )
      }
    </div>
  );
};

export default QuestionAnswer;