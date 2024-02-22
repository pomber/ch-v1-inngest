import { FileNode, FolderNode, TreeNode } from "@/components/code-tree"
import { Code } from "@/components/code"
import { CodeBlock } from "codehike"
import React from "react"

export type ScrollyBlocks = {
  steps: StepBlock[]
  children: React.ReactNode[]
}

export type StepBlock = {
  query: string
  code?: CodeBlock[]
  preview?: Image
  children: React.ReactNode[]
}

type Image = {
  url: string
  alt: string
}

export function aggregateSteps(stepBlocks: StepBlock[]) {
  const files: FolderNode = {
    id: "src",
    name: "src",
    children: [],
  }

  let prevScreenshot: Image | null = null
  return stepBlocks.map(({ code = [], preview }) => {
    code.forEach((codeblock: CodeBlock) => addFile(files, codeblock))
    const filesClone = cloneTree([files])
    prevScreenshot = preview || prevScreenshot
    return {
      files: filesClone,
      // auto select the first code block
      selected: code[0]?.meta || null,
      screenshot: (
        <img
          className="max-w-3xl mx-auto max-h-full"
          src={prevScreenshot?.url}
          alt={prevScreenshot?.alt}
          height="auto"
          width="auto"
        />
      ),
    }
  })
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
