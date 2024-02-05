import { CodeContent, CodeBlock } from "codehike"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { NextStep, StepContent, StepPreview, Steps, StepsNav } from "./steps"
import {
  CodeTree,
  FileLink,
  FileNode,
  FileTreeProvider,
  FolderNode,
  TreeNode,
} from "./code-tree"

function cloneTree(tree: TreeNode[]): TreeNode[] {
  return tree.map((node) => {
    if ("children" in node) {
      return {
        ...node,
        children: cloneTree(node.children),
      }
    }
    return node
  })
}

export function Guide({ hike }: { hike: any }) {
  const files: FolderNode = {
    id: "src",
    name: "src",
    children: [],
  }
  const steps = hike.steps.map((step: any, i: number) => {
    step.code?.forEach((codeblock: CodeBlock) => addFile(files, codeblock))
    const filesClone = cloneTree([files])
    return {
      title: step.query,
      files: filesClone,
      content: <div className="p-2">{step.children}</div>,
      preview: <PreviewSection step={step} files={filesClone} index={i} />,
    }
  })

  return (
    <Steps steps={steps}>
      <FileTreeProvider>
        <main className="flex min-h-0 flex-1 h-screen">
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel
              className="bg-zinc-800 p-2 prose prose-invert flex flex-col"
              minSize={25}
              defaultSize={30}
            >
              {/* left panel */}
              <StepsNav />
              <div className="overflow-auto flex-1 min-h-0 pb-16">
                <StepContent />
                <NextStep className="p-2" />
              </div>
              {/* end left panel */}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              className="flex max-h-full min-h-full flex-col"
              defaultSize={70}
            >
              {/* right panel */}
              <StepPreview />
              {/* end right panel */}
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </FileTreeProvider>
    </Steps>
  )
}

function PreviewSection({ step, files, index }: any) {
  return (
    <section className="w-full bg-zinc-950 flex max-h-full min-h-full flex-col">
      <ResizablePanelGroup direction="vertical" className="">
        <ResizablePanel className="" minSize={20}>
          <CodeTree className="h-full" key={index} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="">
          <div className="text-white flex gap-2">
            <div className="border border-white">Inngest Dev Server</div>
            <div className="border border-white">Nextjs App</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  )
}

function addFile(tree: FolderNode, codeblock: CodeBlock) {
  const path = codeblock.meta || "index"
  const parts = path.split("/")
  let node = { children: [tree] } as FolderNode
  const name = parts.pop() as string
  parts.forEach((part) => {
    const folder = node.children.find((child) => child.name === part)
    if (folder) {
      node = folder as FolderNode
    } else {
      const folder = {
        id: part,
        name: part,
        children: [],
      }
      node.children.push(folder)
      node = folder
    }
  })

  const existing = node.children.find((child) => child.name === name) as
    | FileNode
    | undefined
  if (existing) {
    existing.content = <Code codeblock={codeblock} />
  } else {
    node.children.push({
      id: path,
      name,
      content: <Code codeblock={codeblock} />,
    } as TreeNode)
  }
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
