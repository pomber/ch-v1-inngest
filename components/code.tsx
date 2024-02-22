import { CodeBlock, CodeContent } from "codehike"

export function Code({ codeblock }: { codeblock: CodeBlock }) {
  return (
    <CodeContent
      codeblock={codeblock}
      config={{ theme: "github-dark" }}
      className="min-h-[40rem]"
      components={{ Mark }}
    />
  )
}

function Mark({ children }: { children: string }) {
  return <mark className="bg-blue-400">{children}</mark>
}
