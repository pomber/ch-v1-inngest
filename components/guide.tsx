import { CodeContent, CodeBlock } from "codehike"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { NextStep, StepContent, StepPreview, Steps, StepsNav } from "./steps"
import {
  CodeTree,
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
  let prevScreenshot: any = null
  const steps = hike.steps.map((step: any, i: number) => {
    step.code?.forEach((codeblock: CodeBlock) => addFile(files, codeblock))
    const filesClone = cloneTree([files])
    prevScreenshot = step.preview?.[0]?.children || prevScreenshot
    console.log("prevScreenshot", prevScreenshot)
    return {
      title: step.query,
      files: filesClone,
      // auto select the first code block
      selected: step.code?.[0]?.meta || null,
      screenshot: prevScreenshot,
      content: <div className="p-2">{step.children}</div>,
      preview: <PreviewSection screenshot={prevScreenshot} />,
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

function PreviewSection({ screenshot }: any) {
  return (
    <section className="w-full bg-zinc-950 flex max-h-full min-h-full flex-col">
      <ResizablePanelGroup direction="vertical" className="">
        <ResizablePanel className="" minSize={20}>
          <CodeTree className="h-full" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="">{screenshot}</ResizablePanel>
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
        id: node.id + "/" + part,
        name: part,
        children: [],
      }
      node.children.push(folder)
      node.children.sort((a, b) => a.name.localeCompare(b.name))
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
    node.children.sort((a, b) => a.name.localeCompare(b.name))
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
