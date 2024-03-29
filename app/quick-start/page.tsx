// @ts-ignore
import { getBlocks } from "@/content/getting-started.mdx"
import { CodeTree, FileLink, FileTreeProvider } from "@/components/code-tree"
import { ScrollyBlocks, aggregateSteps } from "./blocks"
import { ScrollyStep, Step, Steps } from "codehike/scrolly"
import { Panels } from "@/components/panels"

export default function GettingStarted() {
  const blocks = getBlocks({ components: { a: CustomLink } })
  const steps = aggregateSteps(blocks.steps)
// TODO make the Intro stand on top of the preview panels until step 2
  return (
    <div>
      <section className="prose prose-invert">
      {blocks.intro.children}
      </section>
    <Steps steps={steps}>
      <FileTreeProvider>
        <Panels
          left={<Content blocks={blocks} />}
          topRight={<Step element="screenshot" />}
          bottomRight={<CodeTree className="h-full" />}
        />
      </FileTreeProvider>
    </Steps></div>
  )
}

function Content({ blocks }: { blocks: ScrollyBlocks }) {
  const content = mapBlocks(blocks, {
    steps: (step: any, index: number) => (
      <ScrollyStep
        key={index}
        stepIndex={index}
        className="border-l-4 border-zinc-700 data-[ch-selected]:border-purple-400 px-5 py-2 mb-24 rounded bg-zinc-900"
      >
        <div className="p-2">{step.children}</div>
      </ScrollyStep>
    ),
  })

  return <div className="overflow-auto px-8 pt-32 pb-[90vh]">{content}</div>
}

const CustomLink = ({
  href,
  children,
  ...rest
}: {
  href: string
  children: React.ReactNode
}) => {
  if (href.startsWith("!")) {
    const value = href.slice(1)
    const [path, mark] = value.split("#")
    return (
      <FileLink path={path} mark={mark}>
        {children}
      </FileLink>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

// TODO move to codehike
function mapBlocks(blocks: any, map: any) {
  return blocks.children.map((kid: any) => {
    if (kid.type !== "slot") {
      return kid
    }
    const { name, index } = kid.props
    if (!map[name]) {
      return null
    }
    if (index != null) {
      const value = blocks[name][index]
      return map[name](value, index)
    }
    return map[name](blocks[name])
  })
}
