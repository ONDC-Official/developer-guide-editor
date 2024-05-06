import { Transition } from "@headlessui/react";

export function DropTransition({ children }: any) {
  return (
    <Transition
      enter="transition duration-200 ease-out"
      enterFrom="transform translate-y-1 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-1 opacity-0"
    >
      {children}
    </Transition>
  );
}
