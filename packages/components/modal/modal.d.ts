import { ClassComponent, GlobalComponentConstructor } from '@silky-ui/utils/ts-helper'

export interface ModalProps {
  title: string,
  content: string,
  type?: 'normal' | 'danger',
}

export interface ModalSlots {}

export declare type ModalEmits = {
  cancle: () => void,
  confirm: () => void,
}

declare class SModal extends ClassComponent<ModalProps, ModalSlots, ModalEmits> {}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    SModal: GlobalComponentConstructor<SModal>,
  }
}

export default SModal