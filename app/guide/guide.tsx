import { CodeContent, CodeBlock } from "codehike"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { StepContent, StepPreview, Steps, StepsNav } from "./steps"
import { FileTree } from "@/components/ui/file-tree"

export function Guide({ hike }: { hike: any }) {
  const steps = hike.steps.map((step: any, i: number) => ({
    title: step.query,
    content: <div className="p-2">{step.children}</div>,
    preview: <PreviewSection step={step} />,
  }))

  return (
    <Steps steps={steps}>
      <main className="flex min-h-0 flex-1 h-screen">
        <ResizablePanelGroup direction="horizontal" className="w-full">
          <ResizablePanel
            className="bg-zinc-800 p-2 prose prose-invert"
            minSize={25}
            defaultSize={30}
          >
            <StepsNav />
            <StepContent />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            className="flex max-h-full min-h-full flex-col"
            defaultSize={70}
          >
            <StepPreview />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </Steps>
  )
}

function PreviewSection({ step }: any) {
  return (
    <section className="w-full bg-zinc-950 flex max-h-full min-h-full flex-col">
      <ResizablePanelGroup direction="vertical" className="">
        <ResizablePanel className="" minSize={20}>
          <div className="flex h-full">
            <div className="flex h-full flex-col border-r border-neutral-700 text-white pt-4 w-48">
              <FileTree
                tree={[
                  {
                    id: "2",
                    name: "src",
                    children: [
                      {
                        id: "c1",
                        name: "inngest",
                        children: [{ id: "c1-1", name: "client.ts" }],
                      },
                      {
                        id: "app",
                        name: "app",
                        children: [
                          {
                            id: "page",
                            name: "page.tsx",
                          },
                        ],
                      },
                    ],
                  },
                ]}
              />
            </div>
            <div className="p-4">
              {step.code.map((code: any) => (
                <Code codeblock={code} />
              ))}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="">Down</ResizablePanel>
      </ResizablePanelGroup>
    </section>
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
