import { ClassComponent, GlobalComponentConstructor } from '@silky-ui/utils/ts-helper'

export interface ButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

export interface ButtonSlots {}

export declare type ButtonEmits = {}

declare class SButton extends ClassComponent<ButtonProps, ButtonSlots, ButtonEmits> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    SButton: GlobalComponentConstructor<SButton>
  }
}

export default SButton