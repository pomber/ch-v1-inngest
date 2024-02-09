import { CodeContent, CodeBlock } from "codehike"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { NextStep, Step, StepContent, Steps, StepsNav } from "./steps"
import {
  CodeTree,
  FileNode,
  FileTreeProvider,
  FolderNode,
  TreeNode,
} from "./code-tree"
import { Panels } from "./panels"

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
    return {
      title: step.query,
      files: filesClone,
      // auto select the first code block
      selected: step.code?.[0]?.meta || null,
      screenshot: prevScreenshot,
      content: <div className="p-2">{step.children}</div>,
      hello: <div>hello {i}</div>,
    }
  })

  return (
    <Steps steps={steps}>
      <FileTreeProvider>
        <Panels
          left={
            <>
              <StepsNav />
              <div className="overflow-auto flex-1 min-h-0 pb-16">
                <StepContent />
                <NextStep className="p-2" />
              </div>
            </>
          }
          topRight={<CodeTree className="h-full" />}
          bottomRight={<Step element="screenshot" />}
        />
      </FileTreeProvider>
    </Steps>
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
