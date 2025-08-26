import { Module } from "@medusajs/framework/utils"
import TypeformModuleService from "./service"

export const TYPEFORM_MODULE = "typeform"

export default Module(TYPEFORM_MODULE, {
  service: TypeformModuleService,
})
