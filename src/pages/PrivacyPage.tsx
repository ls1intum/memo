import Markdown from 'react-markdown';
import privacyContent from '@/content/privacy.md?raw';

export function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#d7e3ff] via-[#f3f5ff] to-[#e8ecff] text-slate-900 dark:from-[#0f1729] dark:via-[#111b30] dark:to-[#0f1729] dark:text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-[-6rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/80 blur-[140px] dark:bg-slate-800/30" />
        <div className="absolute left-[10%] top-[22%] h-80 w-80 rounded-full bg-[#7fb0ff]/35 blur-[120px] dark:bg-[#7fb0ff]/10" />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-20 pt-32 lg:px-0">
        {/* Header */}
        <header className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Information about data protection and your rights
          </p>
        </header>

        {/* Content */}
        <article className="space-y-8 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-[0_26px_90px_-55px_rgba(7,30,84,0.5)] backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-800/60 dark:shadow-[0_26px_90px_-55px_rgba(0,0,0,0.7)]">
          <Markdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mt-3 text-slate-600 dark:text-slate-400">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-400">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => (
                <strong className="font-medium text-slate-700 dark:text-slate-300">
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-[#0a4da2] hover:underline dark:text-[#6b9fff]"
                  target={href?.startsWith('http') ? '_blank' : undefined}
                  rel={
                    href?.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                >
                  {children}
                </a>
              ),
              hr: () => <hr className="my-8 border-slate-200 dark:border-slate-700" />,
              em: ({ children }) => (
                <em className="text-slate-500 dark:text-slate-400">{children}</em>
              ),
            }}
          >
            {privacyContent}
          </Markdown>
        </article>
      </main>
    </div>
  );
}
