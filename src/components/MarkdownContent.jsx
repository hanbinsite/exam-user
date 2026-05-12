import { useState, useCallback, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import mermaid from 'mermaid';
import 'highlight.js/styles/github.css';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

function MermaidDiagram({ chart }) {
  const [svg, setSvg] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    mermaid
      .render(id, chart)
      .then(({ svg: result }) => {
        if (!cancelled) setSvg(result);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (hasError) {
    return (
      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm font-medium mb-2">流程图语法错误</p>
        <pre className="text-red-500 text-xs whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      className="mermaid-container my-6 flex justify-center overflow-x-auto rounded-xl bg-white p-4 border border-slate-200 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function CodeBlock({ className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const isInline = !match;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[0.875em] font-mono border border-amber-200" {...props}>
        {children}
      </code>
    );
  }

  if (match[1] === 'mermaid') {
    return <MermaidDiagram chart={String(children)} />;
  }

  return (
    <div className="code-wrapper relative group my-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span className="font-mono font-medium">{match[1]}</span>
        </span>
        <button
          onClick={handleCopy}
          className="copy-btn flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-500">已复制</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>复制</span>
            </>
          )}
        </button>
      </div>
      <pre className="!m-0 !rounded-none !border-0">
        <code className={className} {...props}>{children}</code>
      </pre>
    </div>
  );
}

export default function MarkdownContent({ content, className = '' }) {
  return (
    <div className={`markdown-body prose prose-sm max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-7 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-blockquote:border-l-4 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-600 prose-li:text-slate-600 prose-li:marker:text-indigo-400 prose-table:text-sm prose-th:bg-slate-50 prose-th:px-3 prose-th:py-2 prose-th:border prose-th:border-slate-200 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-slate-200 prose-img:rounded-lg prose-img:shadow-md prose-hr:border-slate-200 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{ code: CodeBlock }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
}
