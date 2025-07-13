import Accordion from "@modules/products/components/product-tabs/accordion"

interface FilterTemplateProps {
  title: string
  children: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
  className?: string
}

const FilterTemplate = ({
  title,
  children,
  className = ""
}: FilterTemplateProps) => {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item value="item-1" title={title} className={className}>
        {children}
      </Accordion.Item>
    </Accordion>
  )
}

export default FilterTemplate