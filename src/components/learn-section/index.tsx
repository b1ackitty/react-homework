import { ComponentProps } from 'react'

type Props = ComponentProps<'section'> & { title: string; showTitle?: boolean }

export default function LearnSection(props: Props) {
  const { title, showTitle = false, children, ...restProps } = props

  return (
    <section {...restProps}>
      <h1 className={showTitle ? '' : 'sr-only'}>{title}</h1>
      {children}
    </section>
  )
}
