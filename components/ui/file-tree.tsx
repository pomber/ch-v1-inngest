"use client"

import { NodeRendererProps, Tree } from "react-arborist"
import { File, FolderClosed, FolderOpen } from "lucide-react"

function Node({ node, style }: NodeRendererProps<any>) {
  return (
    <div
      style={style}
      onClick={(e) => {
        e.stopPropagation()
        if (!node.isLeaf) {
          // node.toggle()
        } else {
          node.select()
        }
      }}
      className={`cursor-pointer select-none text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800`}
    >
      <div className="flex gap-1 px-2">
        {node.isLeaf ? (
          <File size={20} />
        ) : node.isOpen ? (
          <FolderOpen size={20} />
        ) : (
          <FolderClosed size={20} />
        )}
        <span
          className={
            node.isSelected
              ? "text-blue-300"
              : node.isLeaf
              ? "text-zinc-700 dark:text-zinc-300"
              : ""
          }
        >
          {node.data.name}
        </span>
      </div>
    </div>
  )
}

export function FileTree({
  tree,
  select,
  selected,
}: {
  tree: any
  select: (id: string) => void
  selected: string
}) {
  return (
    <Tree
      data={tree}
      openByDefault={true}
      indent={12}
      rowHeight={24}
      selection={selected}
      width="100%"
      onSelect={(selection) => {
        const selectedNode = selection[0]
        if (selectedNode?.isLeaf) {
          select(selection[0]?.id)
        } else {
          return false
        }
      }}
    >
      {Node}
    </Tree>
  )
}
