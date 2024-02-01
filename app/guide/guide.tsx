import { CodeContent, CodeBlock } from "codehike"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { StepContent, StepPreview, Steps, StepsNav } from "./steps"

export function Guide({ hike }: { hike: any }) {
  const steps = hike.steps.map((step: any, i: number) => ({
    title: step.query,
    content: <div className="">{step.children}</div>,
    preview: (
      <div className="w-full bg-zinc-950 h-full p-2">
        {step.code.map((code: any) => (
          <Code codeblock={code} />
        ))}
      </div>
    ),
  }))

  return (
    <Steps steps={steps}>
      <main className="flex min-h-0 flex-1 h-screen">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel
            className="bg-zinc-800 p-2 prose prose-invert"
            minSize={25}
          >
            <StepsNav />
            <StepContent />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="flex max-h-full min-h-full flex-col">
            <StepPreview />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </Steps>
  )
}

function Code({ codeblock }: { codeblock: CodeBlock }) {
  return (
    <CodeContent
      codeblock={codeblock}
      config={{ theme: "github-dark" }}
      className="min-h-[40rem]"
    />
  )
}
