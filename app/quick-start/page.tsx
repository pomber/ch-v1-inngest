// @ts-ignore
import { getBlocks } from "@/content/getting-started.ch.md"
import { FileLink } from "@/components/code-tree"
import { Guide } from "@/components/scrolly-layout"

export default function GettingStarted() {
  const blocks = getBlocks({
    components: {
      // @ts-ignore
      a: CustomLink,
    },
  })

  return <Guide blocks={blocks} />
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
    return <FileLink path={href.slice(1)}>{children}</FileLink>
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}
