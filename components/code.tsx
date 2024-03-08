import { CodeBlock, CodeContent } from "codehike"

export function Code({ codeblock }: { codeblock: CodeBlock }) {
  return (
    <CodeContent
      codeblock={codeblock}
      config={{ theme: "github-dark" }}
      className="min-h-[40rem]"
      components={{ Mark, Line }}
    />
  )
}

function Line({ children, query }: any) {
  return (
    <div data-line="true" className="px-2">
      <span className="pl-2 pr-4 inline-block w-[2ch] box-content !opacity-50 text-right select-none">
        {query}
      </span>
      {children}
    </div>
  )
}
function Mark({ children }: { children: string }) {
  return <mark className="bg-blue-400">{children}</mark>
}
