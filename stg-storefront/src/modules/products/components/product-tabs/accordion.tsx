import { Text, clx } from "@medusajs/ui"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import React from "react"
import { ChevronDownMini } from "@medusajs/icons"
import ChevronDown from "@modules/common/icons/chevron-down"

interface AccordionItemProps extends AccordionPrimitive.AccordionItemProps {
  title: string
  subtitle?: string
  description?: string
  required?: boolean
  tooltip?: string
  forceMountContent?: true
  headingSize?: "small" | "medium" | "large"
  customTrigger?: React.ReactNode
  complete?: boolean
  active?: boolean
  triggerable?: boolean
  children: React.ReactNode
  borderless?: boolean
  chevronTrigger?: boolean
}

interface AccordionProps extends React.PropsWithChildren<{}> {
  borderless?: boolean
  chevronTrigger?: boolean
  type?: "single" | "multiple"
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
}

const Accordion: React.FC<AccordionProps> & { Item: React.FC<AccordionItemProps> } = ({ children, borderless, chevronTrigger, type, defaultValue, value, onValueChange }) => {
  // Only pass defined props to AccordionPrimitive.Root
  const rootProps: any = {}
  if (type) rootProps.type = type
  if (defaultValue) rootProps.defaultValue = defaultValue
  if (value) rootProps.value = value
  if (onValueChange) rootProps.onValueChange = onValueChange

  return (
    <AccordionPrimitive.Root {...rootProps}>
      {/* Pass borderless and chevronTrigger prop to children */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { borderless, chevronTrigger })
        }
        return child
      })}
    </AccordionPrimitive.Root>
  )
}

const Item: React.FC<AccordionItemProps> = ({
  title,
  subtitle,
  description,
  children,
  className,
  headingSize = "large",
  customTrigger = undefined,
  forceMountContent = undefined,
  triggerable,
  borderless = false,
  chevronTrigger = false,
  ...props
}) => {
  return (
    <AccordionPrimitive.Item
      {...props}
      className={clx(
        borderless
          ? ""
          : "border-grey-20 group border-t last:mb-0 last:border-b",
        "py-3",
        className
      )}
    >
      <AccordionPrimitive.Header className="px-1">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-4">
              <Text className="ext-sm text-ui-fg-base font-medium">{title}</Text>
            </div>
            <AccordionPrimitive.Trigger>
              {customTrigger
                ? customTrigger
                : chevronTrigger
                  ? <ChevronDownTrigger />
                  : <MorphingTrigger />}
            </AccordionPrimitive.Trigger>
          </div>
          {subtitle && (
            <Text as="span" size="small" className="mt-1">
              {subtitle}
            </Text>
          )}
        </div>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content
        forceMount={forceMountContent}
        className={clx(
          "radix-state-closed:animate-accordion-close radix-state-open:animate-accordion-open radix-state-closed:pointer-events-none px-1"
        )}
      >
        <div className="inter-base-regular group-radix-state-closed:animate-accordion-close">
          {description && <Text>{description}</Text>}
          <div className="w-full">{children}</div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  )
}

Accordion.Item = Item

// ChevronDownTrigger: rotates chevron-down icon
const ChevronDownTrigger = () => (
  <span className="transition-transform duration-300 inline-block radix-state-open:rotate-180">
    <ChevronDownMini />
  </span>
)

const MorphingTrigger = () => {
  return (
    <div className="text-grey-90 hover:bg-grey-5 active:bg-grey-5 active:text-violet-60 focus:border-violet-60 disabled:text-grey-30 bg-transparent disabled:bg-transparent rounded-rounded group relative p-[6px]">
      <div className="h-5 w-5">
        <span className="bg-grey-50 rounded-circle group-radix-state-open:rotate-90 absolute inset-y-[31.75%] left-[48%] right-1/2 w-[1.5px] duration-300" />
        <span className="bg-grey-50 rounded-circle group-radix-state-open:rotate-90 group-radix-state-open:left-1/2 group-radix-state-open:right-1/2 absolute inset-x-[31.75%] top-[48%] bottom-1/2 h-[1.5px] duration-300" />
      </div>
    </div>
  )
}

export default Accordion
