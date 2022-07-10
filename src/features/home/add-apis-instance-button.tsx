import { Dialog, Transition } from '@headlessui/react'
import type { FormEvent } from 'react'
import { Fragment } from 'react'

import { useApis } from '@/features/apis/apis.context'
import { Button } from '@/features/ui/button'
import { CheckBox } from '@/features/ui/checkbox'
import { TextArea } from '@/features/ui/textarea'
import { TextField } from '@/features/ui/textfield'
import { useDialogState } from '@/features/ui/use-dialog-state'
import type { ApisInstanceConfig } from '~/config/apis.config'

export function AddApisInstanceButton(): JSX.Element {
  const dialog = useDialogState()
  const { addInstance } = useApis()

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)

    const id = Math.random().toString(36).slice(2, 9)
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const url = formData.get('url') as string
    const image = formData.get('image') as string
    const auth = formData.get('auth') as 'on' | null

    const instance: ApisInstanceConfig = {
      id,
      title,
      subtitle,
      description,
      url,
      image,
      access: auth === 'on' ? { type: 'restricted', user: null } : { type: 'public' },
    }

    addInstance(instance)

    dialog.close()

    event.preventDefault()
  }

  return (
    <Fragment>
      <Button onClick={dialog.open}>Add APIS instance</Button>
      <Transition.Root appear as={Fragment} show={dialog.isOpen}>
        <Dialog as="div" className="relative z-dialog" onClose={dialog.close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500/25 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-dialog grid place-items-center overflow-y-auto p-4 sm:p-6 md:p-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="grid w-full max-w-md gap-4 rounded bg-white p-8 shadow-lg">
                <Dialog.Title>Add APIS instance</Dialog.Title>
                <form className="grid gap-4" onSubmit={onSubmit}>
                  <div className="grid gap-2">
                    <TextField label="Title" name="title" required />
                    <TextField label="Subtitle" name="subtitle" />
                    <TextArea label="Description" name="description" rows={4} />
                    <TextField label="URL" name="url" required type="url" />
                    <TextField label="Image URL" name="image" type="url" />
                    <CheckBox label="Requires authentication?" name="auth" />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button onClick={dialog.close}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  )
}
