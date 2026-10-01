import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../helper";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Answer = ({ ans, totalResult, index, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    }
  }, [ans]);

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          style={dark}
          language={match[1]}
          PreTag="div"
        />
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-xl block text-zinc-900 dark:text-white font-semibold">
          {answer}
        </span>
      ) : heading ? (
        <span className="pt-2 text-lg block text-zinc-900 dark:text-white font-medium">
          {answer}
        </span>
      ) : (
        <span
          className={
            type === "q"
              ? "pl-1 text-zinc-900 dark:text-white"
              : "pl-5 text-zinc-700 dark:text-zinc-300 block"
          }
        >
          <ReactMarkdown components={renderers}>{answer}</ReactMarkdown>
        </span>
      )}
    </>
  );
};

export default Answer;